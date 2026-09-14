import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  tipo: z.enum(['RG_CNH', 'COMPROVANTE_ENDERECO', 'CERTIFICADO']),
  storagePath: z.string().min(1),
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

  // storagePath tem que comecar com o uuid do proprio usuario - trava contra registrar arquivo de outra pasta
  if (!parsed.data.storagePath.startsWith(`${usuario.id}/`)) {
    return NextResponse.json({ erro: 'Caminho de arquivo invalido' }, { status: 403 });
  }

  const documento = await prisma.documentoCandidato.create({
    data: {
      candidatoId: candidato.id,
      tipo: parsed.data.tipo,
      storagePath: parsed.data.storagePath,
      status: 'PENDENTE',
    },
  });

  return NextResponse.json({ ok: true, documento });
}