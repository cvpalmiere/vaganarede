import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularScoreSkills } from "@/lib/compatibilidade";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "CANDIDATO") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const candidato = await prisma.candidato.findUnique({
    where: { usuarioId: usuario.id },
    include: { skills: true },
  });
  if (!candidato) return NextResponse.json({ erro: "Candidato nao encontrado" }, { status: 404 });

  const vagasAtivas = await prisma.vaga.findMany({
    where: { status: "ATIVA" },
    include: { skills: true, empresa: { select: { razaoSocial: true } } },
  });

  const skillsCandidato = candidato.skills.map((s) => ({ skillId: s.skillId, nivel: s.nivel }));

  const resultados = [];
  for (const vaga of vagasAtivas) {
    const skillsVaga = vaga.skills.map((s) => ({ skillId: s.skillId, peso: s.peso }));
    const score = calcularScoreSkills(skillsCandidato, skillsVaga);

    // grava o match para nao recalcular do zero toda vez, e para a Empresa poder consultar depois
    await prisma.matchCompatibilidade.upsert({
      where: { candidatoId_vagaId: { candidatoId: candidato.id, vagaId: vaga.id } },
      update: { score, calculadoEm: new Date() },
      create: { candidatoId: candidato.id, vagaId: vaga.id, score },
    });

    resultados.push({
      vagaId: vaga.id,
      titulo: vaga.titulo,
      empresa: vaga.empresa.razaoSocial,
      cidade: vaga.cidade,
      score,
    });
  }

  resultados.sort((a, b) => b.score - a.score);
  return NextResponse.json({ matches: resultados });
}