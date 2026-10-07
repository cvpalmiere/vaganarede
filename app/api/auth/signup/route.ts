import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { supabaseAdmin } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { hashDocumento, encryptDocumento } from "@/lib/crypto";
import { validarCnpj, normalizarCnpj } from "@/lib/cnpj";
import { validarCpf, normalizarCpf } from "@/lib/cpf";
import { verificarLimite, obterIp, requisicaoEhDeTesteE2E } from "@/lib/rate-limit";

const baseSchema = z.object({
email: z.string().email(),
senha: z.string().min(8),
nome: z.string().min(2),
aceiteTermos: z.literal("true", { errorMap: () => ({ message: "E necessario aceitar os termos de uso" }) }),
});

const candidatoSchema = baseSchema.extend({
tipo: z.literal("CANDIDATO"),
cpf: z
.string()
.transform(normalizarCpf)
.refine((v) => v.length === 11, { message: "CPF precisa ter 11 digitos" })
.refine(validarCpf, { message: "CPF invalido" }),
escolaridade: z.string().optional(),
curso: z.string().optional(),
});

const empresaSchema = baseSchema.extend({
tipo: z.enum(["EMPRESA", "EMPRESA_RH"]),
cnpj: z
.string()
.transform(normalizarCnpj)
.refine((v) => v.length === 14, { message: "CNPJ precisa ter 14 digitos" })
.refine(validarCnpj, { message: "CNPJ invalido" }),
telefone: z.string().min(10),
cidade: z.string().min(2),
});

const signupSchema = z.discriminatedUnion("tipo", [
candidatoSchema,
empresaSchema.extend({ tipo: z.literal("EMPRESA") }),
empresaSchema.extend({ tipo: z.literal("EMPRESA_RH") }),
]);

export async function POST(request: Request) {
const ip = obterIp(request);
if (!requisicaoEhDeTesteE2E(request) && !verificarLimite(signup:${ip}, 10, 60 * 60 * 1000)) {
return NextResponse.json({ erro: "Muitas tentativas de cadastro. Tente novamente mais tarde." }, { status: 429 });
}

const body = await request.json();
const parsed = signupSchema.safeParse(body);

if (!parsed.success) {
const mensagem = parsed.error.issues[0]?.message ?? "Dados invalidos";
return NextResponse.json({ erro: mensagem, detalhes: parsed.error.flatten() }, { status: 400 });
}

const dados = parsed.data;

const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
email: dados.email,
password: dados.senha,
email_confirm: true,
app_metadata: { tipo_usuario: dados.tipo },
});

if (authError || !authUser.user) {
return NextResponse.json({ erro: authError?.message ?? "Falha ao criar usuario" }, { status: 400 });
}

try {
await prisma.$transaction(async (tx) => {
await tx.usuario.create({
data: { id: authUser.user.id, email: dados.email, tipo: dados.tipo },
});

  if (dados.tipo === "CANDIDATO") {
    await tx.candidato.create({
      data: {
        usuarioId: authUser.user.id,
        nomeCompleto: dados.nome,
        cpfHash: hashDocumento(dados.cpf),
        cpfCriptografado: encryptDocumento(dados.cpf),
        escolaridade: dados.escolaridade ?? null,
        curso: dados.curso ?? null,
        telefone: "",
        cidade: "",
        latitude: 0,
        longitude: 0,
      },
    });
    return;
  }

  const cnpjHash = hashDocumento(dados.cnpj);
  const cnpjCriptografado = encryptDocumento(dados.cnpj);

  if (dados.tipo === "EMPRESA") {
    await tx.empresa.create({
      data: {
        usuarioId: authUser.user.id,
        razaoSocial: dados.nome,
        cnpjHash,
        cnpjCriptografado,
        telefone: dados.telefone,
        cidade: dados.cidade,
        aprovado: false,
      },
    });
    return;
  }

  await tx.empresaRh.create({
    data: {
      usuarioId: authUser.user.id,
      razaoSocial: dados.nome,
      cnpjHash,
      cnpjCriptografado,
      aprovado: false,
    },
  });
});


} catch (dbError) {
await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);

const isConflito = dbError instanceof Prisma.PrismaClientKnownRequestError && dbError.code === "P2002";

return NextResponse.json(
  {
    erro: isConflito ? "CNPJ ou CPF ja cadastrado" : "Falha ao criar perfil",
    ...(process.env.NODE_ENV !== "production" && !isConflito
      ? { detalhe: dbError instanceof Error ? dbError.message : String(dbError) }
      : {}),
  },
  { status: isConflito ? 409 : 500 }
);


}

return NextResponse.json({ ok: true, usuarioId: authUser.user.id });
}