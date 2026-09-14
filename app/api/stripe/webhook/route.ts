import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const assinaturaStripe = request.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    // valida a assinatura - sem isso qualquer um poderia forjar um "pagamento aprovado"
    event = stripe.webhooks.constructEvent(rawBody, assinaturaStripe!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ erro: 'Assinatura invalida' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const assinaturaId = session.metadata?.assinaturaId;
      if (!assinaturaId) break;

      await prisma.assinatura.update({
        where: { id: assinaturaId },
        data: {
          status: 'ATIVO',
          gatewayClienteId: session.customer as string,
          gatewayAssinaturaId: session.subscription as string,
          inicioEm: new Date(),
        },
      });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await prisma.assinatura.updateMany({
        where: { gatewayClienteId: invoice.customer as string },
        data: { status: 'INADIMPLENTE' },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.assinatura.updateMany({
        where: { gatewayAssinaturaId: subscription.id },
        data: { status: 'CANCELADO', fimEm: new Date() },
      });
      break;
    }
  }

  return NextResponse.json({ recebido: true });
}