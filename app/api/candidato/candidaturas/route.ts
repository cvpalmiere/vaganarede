import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "CANDIDATO") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const candidato = await prisma.candidato.findUnique({ where: { usuarioId: usuario.id } });
  if (!candidato) return NextResponse.json({ erro: "Candidato nao encontrado" }, { status: 404 });

  const candidaturas = await prisma.candidatura.findMany({
    where: { candidatoId: candidato.id },
    include: { vaga: { include: { empresa: true } } },
    orderBy: { criadaEm: "desc" },
  });

  return NextResponse.json({ candidaturas });
}