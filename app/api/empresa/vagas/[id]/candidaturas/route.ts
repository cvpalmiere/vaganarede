import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verificarDonaDaVaga(usuarioId: string, vagaId: string) {
  const vaga = await prisma.vaga.findUnique({
    where: { id: vagaId },
    include: { empresa: true },
  });
  if (!vaga) return null;
  if (vaga.empresa.usuarioId !== usuarioId) return null;
  return vaga;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const vaga = await verificarDonaDaVaga(usuario.id, id);
  if (!vaga) return NextResponse.json({ erro: "Vaga nao encontrada" }, { status: 404 });

  const candidaturas = await prisma.candidatura.findMany({
    where: { vagaId: id },
    include: {
      candidato: {
        include: { skills: { include: { skill: true } } },
      },
    },
    orderBy: { criadaEm: "desc" },
  });

  return NextResponse.json({ vaga, candidaturas });
}

const schema = z.object({
  candidaturaId: z.string().uuid(),
  status: z.enum(["ENVIADA", "EM_ANALISE", "ENTREVISTA", "OFERTA", "REJEITADA"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const vaga = await verificarDonaDaVaga(usuario.id, id);
  if (!vaga) return NextResponse.json({ erro: "Vaga nao encontrada" }, { status: 404 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados invalidos" }, { status: 400 });
  }

  // confirma que a candidatura pertence mesmo a essa vaga - trava contra editar candidatura de outra empresa
  const candidatura = await prisma.candidatura.findFirst({
    where: { id: parsed.data.candidaturaId, vagaId: id },
  });
  if (!candidatura) return NextResponse.json({ erro: "Candidatura nao encontrada" }, { status: 404 });

  const atualizada = await prisma.candidatura.update({
    where: { id: parsed.data.candidaturaId },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, candidatura: atualizada });
}