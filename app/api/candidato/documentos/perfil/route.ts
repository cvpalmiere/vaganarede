import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  telefone: z.string().min(10).optional(),
  cidade: z.string().min(2).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  resumoProfissional: z.string().max(1000).optional(),
});

// campos considerados no calculo de completude - cada um vale peso igual
const CAMPOS_COMPLETUDE = ['telefone', 'cidade', 'linkedinUrl', 'githubUrl', 'resumoProfissional'] as const;

export async function PATCH(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== 'CANDIDATO') {
    return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: 'Dados invalidos', detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const candidatoAtual = await prisma.candidato.findUnique({ where: { usuarioId: usuario.id } });
  if (!candidatoAtual) return NextResponse.json({ erro: 'Candidato nao encontrado' }, { status: 404 });

  const dadosMesclados = { ...candidatoAtual, ...parsed.data };
  const camposPreenchidos = CAMPOS_COMPLETUDE.filter((campo) => Boolean(dadosMesclados[campo])).length;
  const completudePerfil = Math.round((camposPreenchidos / CAMPOS_COMPLETUDE.length) * 100);

  const candidato = await prisma.candidato.update({
    where: { usuarioId: usuario.id },
    data: { ...parsed.data, completudePerfil },
  });

  return NextResponse.json({ ok: true, candidato });
}