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

  const notificacoes = await prisma.notificacao.findMany({
    where: { candidatoId: candidato.id },
    orderBy: { enviadaEm: "desc" },
    take: 30,
  });

  return NextResponse.json({ notificacoes });
}