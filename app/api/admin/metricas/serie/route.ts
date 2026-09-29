import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "ADMIN") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

  const candidatos = await prisma.candidato.findMany({
    where: { criadoEm: { gte: seteDiasAtras } },
    select: { criadoEm: true },
  });
  const candidaturas = await prisma.candidatura.findMany({
    where: { criadaEm: { gte: seteDiasAtras } },
    select: { criadaEm: true },
  });

  const dias: { data: string; candidatos: number; candidaturas: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dia = new Date();
    dia.setDate(dia.getDate() - i);
    const chave = dia.toISOString().slice(0, 10);
    dias.push({
      data: chave,
      candidatos: candidatos.filter((c) => c.criadoEm.toISOString().slice(0, 10) === chave).length,
      candidaturas: candidaturas.filter((c) => c.criadaEm.toISOString().slice(0, 10) === chave).length,
    });
  }

  return NextResponse.json({ dias });
}