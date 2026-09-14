import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  nome: z.string().min(2).max(50),
  nivel: z.number().int().min(1).max(5),
});

export async function POST(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== 'CANDIDATO') {
    return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: 'Dados invalidos' }, { status: 400 });
  }

  const candidato = await prisma.candidato.findUnique({ where: { usuarioId: usuario.id } });
  if (!candidato) return NextResponse.json({ erro: 'Candidato nao encontrado' }, { status: 404 });

  // busca a skill pelo nome (case insensitive) ou cria se for a primeira vez que alguem cita ela
  const nomeNormalizado = parsed.data.nome.trim().toLowerCase();
  const skill = await prisma.skill.upsert({
    where: { nome: nomeNormalizado },
    update: {},
    create: { nome: nomeNormalizado },
  });

  const candidatoSkill = await prisma.candidatoSkill.upsert({
    where: { candidatoId_skillId: { candidatoId: candidato.id, skillId: skill.id } },
    update: { nivel: parsed.data.nivel },
    create: { candidatoId: candidato.id, skillId: skill.id, nivel: parsed.data.nivel },
  });

  return NextResponse.json({ ok: true, candidatoSkill });
}