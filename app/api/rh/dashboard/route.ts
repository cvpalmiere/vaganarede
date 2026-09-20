import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA_RH") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const empresaRh = await prisma.empresaRh.findUnique({ where: { usuarioId: usuario.id } });
  if (!empresaRh) return NextResponse.json({ erro: "Nao encontrado" }, { status: 404 });

  const empresasCliente = await prisma.empresa.findMany({
    where: { empresaRhId: empresaRh.id },
    include: {
      vagas: {
        include: { _count: { select: { candidaturas: true } } },
      },
    },
  });

  const totalVagas = empresasCliente.reduce((soma, e) => soma + e.vagas.length, 0);
  const totalCandidaturas = empresasCliente.reduce(
    (soma, e) => soma + e.vagas.reduce((s, v) => s + v._count.candidaturas, 0),
    0
  );
  const vagasAtivas = empresasCliente.reduce(
    (soma, e) => soma + e.vagas.filter((v) => v.status === "ATIVA").length,
    0
  );

  const resumoPorCliente = empresasCliente.map((e) => ({
    id: e.id,
    razaoSocial: e.razaoSocial,
    totalVagas: e.vagas.length,
    totalCandidaturas: e.vagas.reduce((s, v) => s + v._count.candidaturas, 0),
  }));

  return NextResponse.json({
    totalClientes: empresasCliente.length,
    totalVagas,
    vagasAtivas,
    totalCandidaturas,
    resumoPorCliente,
  });
}