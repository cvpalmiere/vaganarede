// USO EXCLUSIVO EM DEV - cria/atualiza as contas de teste (Admin, Empresa, Empresa RH) direto no banco,
// com assinatura ja ATIVO, sem passar pelo checkout real do Stripe. Idempotente: pode rodar quantas vezes quiser.
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";
import { hashDocumento, encryptDocumento } from "../lib/crypto";
import { validarCnpj } from "../lib/cnpj";
import ws from "ws";

// client proprio do script - nao usa lib/supabase.ts porque ele importa "server-only",
// que so funciona dentro do runtime do Next.js, nao rodando solto via tsx
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: ws as unknown as never },
  }
);

async function criarOuPegarUsuarioAuth(email: string, senha: string, tipo: string) {
  const { data: existente } = await supabaseAdmin.auth.admin.listUsers();
  const jaExiste = existente.users.find((u) => u.email === email);
  if (jaExiste) return jaExiste.id;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    app_metadata: { tipo_usuario: tipo },
  });
  if (error || !data.user) throw new Error("Falha ao criar usuario auth: " + email + " - " + error?.message);
  return data.user.id;
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL!;
  const senha = process.env.SEED_ADMIN_SENHA!;
  const usuarioId = await criarOuPegarUsuarioAuth(email, senha, "ADMIN");

  await prisma.usuario.upsert({
    where: { id: usuarioId },
    update: { tipo: "ADMIN" },
    create: { id: usuarioId, email, tipo: "ADMIN" },
  });

  console.log("Admin pronto:", email);
}

async function seedEmpresa() {
  const email = process.env.SEED_EMPRESA_EMAIL!;
  const senha = process.env.SEED_EMPRESA_SENHA!;
  const cnpj = process.env.SEED_EMPRESA_CNPJ!;

  if (!validarCnpj(cnpj)) throw new Error("SEED_EMPRESA_CNPJ invalido: " + cnpj);

  const usuarioId = await criarOuPegarUsuarioAuth(email, senha, "EMPRESA");

  await prisma.usuario.upsert({
    where: { id: usuarioId },
    update: { tipo: "EMPRESA" },
    create: { id: usuarioId, email, tipo: "EMPRESA" },
  });

  const empresa = await prisma.empresa.upsert({
    where: { usuarioId },
    update: {},
    create: {
      usuarioId,
      razaoSocial: "Empresa Teste LTDA",
      cnpjHash: hashDocumento(cnpj),
      cnpjCriptografado: encryptDocumento(cnpj),
      telefone: "61999999999",
      cidade: "Brasilia",
    },
  });

  await prisma.assinatura.upsert({
    where: { empresaId: empresa.id },
    update: { status: "ATIVO" },
    create: { empresaId: empresa.id, plano: "EMPRESA", status: "ATIVO", inicioEm: new Date() },
  });

  console.log("Empresa de teste pronta:", email);
}

async function seedEmpresaRh() {
  const email = process.env.SEED_EMPRESA_RH_EMAIL!;
  const senha = process.env.SEED_EMPRESA_RH_SENHA!;
  const cnpj = process.env.SEED_EMPRESA_RH_CNPJ!;

  if (!validarCnpj(cnpj)) throw new Error("SEED_EMPRESA_RH_CNPJ invalido: " + cnpj);

  const usuarioId = await criarOuPegarUsuarioAuth(email, senha, "EMPRESA_RH");

  await prisma.usuario.upsert({
    where: { id: usuarioId },
    update: { tipo: "EMPRESA_RH" },
    create: { id: usuarioId, email, tipo: "EMPRESA_RH" },
  });

  const empresaRh = await prisma.empresaRh.upsert({
    where: { usuarioId },
    update: {},
    create: {
      usuarioId,
      razaoSocial: "Agencia RH Teste LTDA",
      cnpjHash: hashDocumento(cnpj),
      cnpjCriptografado: encryptDocumento(cnpj),
    },
  });

  await prisma.assinatura.upsert({
    where: { empresaRhId: empresaRh.id },
    update: { status: "ATIVO" },
    create: { empresaRhId: empresaRh.id, plano: "EMPRESA_RH", status: "ATIVO", inicioEm: new Date() },
  });

  console.log("Empresa de RH de teste pronta:", email);
}

async function main() {
  await seedAdmin();
  await seedEmpresa();
  await seedEmpresaRh();
  console.log("Seed concluido.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
