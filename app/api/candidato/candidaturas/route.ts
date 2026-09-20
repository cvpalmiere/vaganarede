import { NextResponse } from "next/server";
import { z } from "zod";
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

const schema = z.object({ vagaId: z.string().uuid() });

export async function POST(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "CANDIDATO") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados invalidos" }, { status: 400 });
  }

  const candidato = await prisma.candidato.findUnique({ where: { usuarioId: usuario.id } });
  if (!candidato) return NextResponse.json({ erro: "Candidato nao encontrado" }, { status: 404 });

  const vaga = await prisma.vaga.findUnique({ where: { id: parsed.data.vagaId } });
  if (!vaga || vaga.status !== "ATIVA") {
    return NextResponse.json({ erro: "Vaga nao encontrada" }, { status: 404 });
  }

  try {
    const candidatura = await prisma.candidatura.create({
      data: {
        candidatoId: candidato.id,
        vagaId: vaga.id,
        // score real entra no motor de compatibilidade (dia 16-17) - por enquanto fica zerado
        scoreCompatibilidade: 0,
      },
    });
    return NextResponse.json({ ok: true, candidatura });
  } catch {
    return NextResponse.json({ erro: "Voce ja se candidatou a essa vaga" }, { status: 409 });
  }
}