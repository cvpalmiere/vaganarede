// USO EXCLUSIVO EM DEV/TESTE - ativa uma assinatura sem passar pelo checkout real do Stripe,
// para destravar telas que exigem plano ativo durante testes automatizados.
// Nunca rodar isso contra o banco de producao.
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("uso: npx tsx scripts/ativar-assinatura-teste.ts email@exemplo.com");
    process.exit(1);
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    console.error("usuario nao encontrado:", email);
    process.exit(1);
  }

  if (usuario.tipo === "EMPRESA") {
    const empresa = await prisma.empresa.findUnique({ where: { usuarioId: usuario.id } });
    if (empresa) {
      await prisma.assinatura.updateMany({
        where: { empresaId: empresa.id },
        data: { status: "ATIVO", inicioEm: new Date() },
      });
    }
  } else if (usuario.tipo === "EMPRESA_RH") {
    const empresaRh = await prisma.empresaRh.findUnique({ where: { usuarioId: usuario.id } });
    if (empresaRh) {
      await prisma.assinatura.updateMany({
        where: { empresaRhId: empresaRh.id },
        data: { status: "ATIVO", inicioEm: new Date() },
      });
    }
  }

  console.log("assinatura ativada para:", email);
}

main().finally(() => prisma.$disconnect());
