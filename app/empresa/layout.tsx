import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== 'EMPRESA') redirect('/login');

  const empresa = await prisma.empresa.findUnique({
    where: { usuarioId: usuario.id },
    include: { assinatura: true },
  });

  // paywall absoluto - sem assinatura ativa, so acessa a tela de pagamento
  if (empresa?.assinatura?.status !== 'ATIVO') redirect('/empresa/assinatura');

  return <>{children}</>;
}