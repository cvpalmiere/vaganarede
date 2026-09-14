import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { gerarUrlUploadDocumento } from '@/lib/storage';

const schema = z.object({
  extensao: z.enum(['pdf', 'jpg', 'jpeg', 'png']),
});

export async function POST(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== 'CANDIDATO') {
    return NextResponse.json({ erro: 'Nao autorizado' }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: 'Extensao invalida' }, { status: 400 });
  }

  const resultado = await gerarUrlUploadDocumento(usuario.id, parsed.data.extensao);
  return NextResponse.json(resultado);
}