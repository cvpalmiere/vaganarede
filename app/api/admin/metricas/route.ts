import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "ADMIN") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const [totalCandidatos, totalEmpresas, totalEmpresasRh, totalVagasAtivas, totalCandidaturas, assinaturasAtivas, assinaturasPendentes, assinaturasInadimplentes] = await Promise.all([
    prisma.candidato.count(),
    prisma.empresa.count(),
    prisma.empresaRh.count(),
    prisma.vaga.count({ where: { status: "ATIVA" } }),
    prisma.candidatura.count(),
    prisma.assinatura.count({ where: { status: "ATIVO" } }),
    prisma.assinatura.count({ where: { status: "PENDENTE" } }),
    prisma.assinatura.count({ where: { status: "INADIMPLENTE" } }),
  ]);

  const mrrEstimado = assinaturasAtivas; // valor real calculado abaixo, junto do detalhamento por plano
  const [ativosEmpresa, ativosRh] = await Promise.all([
    prisma.assinatura.count({ where: { status: "ATIVO", plano: "EMPRESA" } }),
    prisma.assinatura.count({ where: { status: "ATIVO", plano: "EMPRESA_RH" } }),
  ]);
  const mrr = ativosEmpresa * 299 + ativosRh * 899;

  return NextResponse.json({
    totalCandidatos,
    totalEmpresas,
    totalEmpresasRh,
    totalVagasAtivas,
    totalCandidaturas,
    assinaturasAtivas,
    assinaturasPendentes,
    assinaturasInadimplentes,
    mrr,
  });
}