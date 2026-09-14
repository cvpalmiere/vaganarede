import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { hashDocumento, encryptDocumento } from '@/lib/crypto';
import { validarCnpj } from '@/lib/cnpj';

const baseSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
  nome: z.string().min(2),
});

const candidatoSchema = baseSchema.extend({
  tipo: z.literal('CANDIDATO'),
  cpf: z.string().min(11),
});

const empresaSchema = baseSchema.extend({
  tipo: z.enum(['EMPRESA', 'EMPRESA_RH']),
  cnpj: z.string().min(14),
  telefone: z.string().min(10),
  cidade: z.string().min(2),
});

const signupSchema = z.discriminatedUnion('tipo', [
  candidatoSchema,
  empresaSchema.extend({ tipo: z.literal('EMPRESA') }),
  empresaSchema.extend({ tipo: z.literal('EMPRESA_RH') }),
]);

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ erro: 'Dados invalidos', detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const dados = parsed.data;

  if (dados.tipo !== 'CANDIDATO' && !validarCnpj(dados.cnpj)) {
    return NextResponse.json({ erro: 'CNPJ invalido' }, { status: 400 });
  }

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: dados.email,
    password: dados.senha,
    email_confirm: true,
    app_metadata: { tipo_usuario: dados.tipo },
  });

  if (authError || !authUser.user) {
    return NextResponse.json({ erro: authError?.message ?? 'Falha ao criar usuario' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.usuario.create({
        data: { id: authUser.user.id, email: dados.email, tipo: dados.tipo },
      });

      if (dados.tipo === 'CANDIDATO') {
        await tx.candidato.create({
          data: {
            usuarioId: authUser.user.id,
            nomeCompleto: dados.nome,
            cpfHash: hashDocumento(dados.cpf),
            cpfCriptografado: encryptDocumento(dados.cpf),
            telefone: '',
            cidade: '',
            latitude: 0,
            longitude: 0,
          },
        });
        return;
      }

      const cnpjHash = hashDocumento(dados.cnpj);
      const cnpjCriptografado = encryptDocumento(dados.cnpj);

      if (dados.tipo === 'EMPRESA') {
        const empresa = await tx.empresa.create({
          data: {
            usuarioId: authUser.user.id,
            razaoSocial: dados.nome,
            cnpjHash,
            cnpjCriptografado,
            telefone: dados.telefone,
            cidade: dados.cidade,
          },
        });

        await tx.assinatura.create({
          data: { empresaId: empresa.id, plano: 'EMPRESA', status: 'PENDENTE' },
        });
        return;
      }

      const empresaRh = await tx.empresaRh.create({
        data: {
          usuarioId: authUser.user.id,
          razaoSocial: dados.nome,
          cnpjHash,
          cnpjCriptografado,
        },
      });

      await tx.assinatura.create({
        data: { empresaRhId: empresaRh.id, plano: 'EMPRESA_RH', status: 'PENDENTE' },
      });
    });
  } catch (dbError) {
    // reverte o usuario do auth se a escrita no banco falhar - evita usuario orfao
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);

    // so e conflito de verdade quando o Prisma aponta violacao de unicidade (P2002)
    const isConflito = dbError instanceof Prisma.PrismaClientKnownRequestError && dbError.code === 'P2002';

    return NextResponse.json(
      {
        erro: isConflito ? 'CNPJ ou CPF ja cadastrado' : 'Falha ao criar perfil',
        ...(process.env.NODE_ENV !== 'production' && !isConflito
          ? { detalhe: dbError instanceof Error ? dbError.message : String(dbError) }
          : {}),
      },
      { status: isConflito ? 409 : 500 }
    );
  }

  return NextResponse.json({ ok: true, usuarioId: authUser.user.id });
}