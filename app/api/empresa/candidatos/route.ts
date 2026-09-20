import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const empresa = await prisma.empresa.findUnique({
    where: { usuarioId: usuario.id },
    include: { assinatura: true },
  });
  // trava redundante - o layout ja bloqueia sem assinatura ativa, mas a api confirma de novo
  if (empresa?.assinatura?.status !== "ATIVO") {
    return NextResponse.json({ erro: "Assinatura inativa" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const vagaId = searchParams.get("vagaId");
  const cidade = searchParams.get("cidade");

  const candidatos = await prisma.candidato.findMany({
    where: {
      completudePerfil: { gt: 0 },
      ...(cidade ? { cidade: { contains: cidade, mode: "insensitive" } } : {}),
    },
    include: { skills: { include: { skill: true } } },
    orderBy: { completudePerfil: "desc" },
    take: 50,
  });

  // ranking provisorio por sobreposicao de skills com a vaga informada -
  // isso sera substituido pelo motor de compatibilidade completo no Dia 16-17 (peso de salario, modelo, nivel, distancia)
  let skillsDaVaga: string[] = [];
  if (vagaId) {
    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: { skills: { include: { skill: true } } },
    });
    skillsDaVaga = vaga?.skills.map((v) => v.skill.nome) ?? [];
  }

  const comScore = candidatos.map((c) => {
    const nomesCandidato = c.skills.map((s) => s.skill.nome);
    const overlap = skillsDaVaga.filter((s) => nomesCandidato.includes(s)).length;
    const scoreProvisorio = skillsDaVaga.length > 0 ? Math.round((overlap / skillsDaVaga.length) * 100) : 0;
    return { ...c, scoreProvisorio };
  });

  comScore.sort((a, b) => b.scoreProvisorio - a.scoreProvisorio);

  return NextResponse.json({ candidatos: comScore });
}