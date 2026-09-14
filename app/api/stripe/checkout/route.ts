import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// mapeia o tipo de usuario pro price certo - nenhum valor de plano fica no front-end
const PRICE_POR_TIPO: Record<string, string> = {
  EMPRESA: process.env.STRIPE_PRICE_ID_EMPRESA!,
  EMPRESA_RH: process.env.STRIPE_PRICE_ID_EMPRESA_RH!,
};

export async function POST() {
  const usuario = await getSessionUser();
  if (!usuario || !['EMPRESA', 'EMPRESA_RH'].includes(usuario.tipo)) {
    return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 });
  }

  const assinatura = usuario.tipo === 'EMPRESA'
    ? await prisma.assinatura.findFirst({ where: { empresa: { usuarioId: usuario.id } } })
    : await prisma.assinatura.findFirst({ where: { empresaRh: { usuarioId: usuario.id } } });

  if (!assinatura) {
    return NextResponse.json({ erro: 'Assinatura nao encontrada' }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: usuario.email,
    line_items: [{ price: PRICE_POR_TIPO[usuario.tipo], quantity: 1 }],
    // metadata e o unico jeito confiavel de saber qual Assinatura atualizar quando o webhook chegar
    metadata: { assinaturaId: assinatura.id, tipoUsuario: usuario.tipo },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${usuario.tipo === 'EMPRESA' ? 'empresa' : 'rh'}?checkout=sucesso`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${usuario.tipo === 'EMPRESA' ? 'empresa' : 'rh'}/assinatura?checkout=cancelado`,
  });

  return NextResponse.json({ url: session.url });
}