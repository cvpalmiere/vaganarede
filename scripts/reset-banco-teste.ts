// USO EXCLUSIVO EM DEV - apaga todas as contas do banco EXCETO as listadas em RESET_MANTER_EMAILS
// e as 3 contas de seed (SEED_ADMIN_EMAIL, SEED_EMPRESA_EMAIL, SEED_EMPRESA_RH_EMAIL).
// Apaga na ordem certa pra nao esbarrar em chave estrangeira. NUNCA rodar contra producao.
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { prisma } from "../lib/prisma";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: ws as unknown as never },
  }
);

function emailsParaManter(): string[] {
  const extras = (process.env.RESET_MANTER_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
  const seed = [process.env.SEED_ADMIN_EMAIL, process.env.SEED_EMPRESA_EMAIL, process.env.SEED_EMPRESA_RH_EMAIL].filter(Boolean) as string[];
  return [...new Set([...extras, ...seed])];
}

async function main() {
  const manter = emailsParaManter();
  console.log("Mantendo estas contas:", manter);

  const { data } = await supabaseAdmin.auth.admin.listUsers();
  const usuariosParaApagar = data.users.filter((u) => u.email && !manter.includes(u.email));
  const idsParaApagar = usuariosParaApagar.map((u) => u.id);

  console.log("Contas que serao apagadas:", usuariosParaApagar.length);

  if (idsParaApagar.length === 0) {
    console.log("Nada para apagar.");
    return;
  }

  const empresasClienteDeRh = await prisma.empresa.findMany({
    where: { empresaRh: { usuarioId: { in: idsParaApagar } } },
    select: { id: true },
  });
  const empresasProprias = await prisma.empresa.findMany({
    where: { usuarioId: { in: idsParaApagar } },
    select: { id: true },
  });
  const todasEmpresasIds = [...empresasClienteDeRh, ...empresasProprias].map((e) => e.id);

  const candidatosIds = (
    await prisma.candidato.findMany({ where: { usuarioId: { in: idsParaApagar } }, select: { id: true } })
  ).map((c) => c.id);

  const vagasIds = (
    await prisma.vaga.findMany({ where: { empresaId: { in: todasEmpresasIds } }, select: { id: true } })
  ).map((v) => v.id);

  await prisma.matchCompatibilidade.deleteMany({ where: { OR: [{ candidatoId: { in: candidatosIds } }, { vagaId: { in: vagasIds } }] } });
  await prisma.candidatura.deleteMany({ where: { OR: [{ candidatoId: { in: candidatosIds } }, { vagaId: { in: vagasIds } }] } });
  await prisma.documentoCandidato.deleteMany({ where: { candidatoId: { in: candidatosIds } } });
  await prisma.candidatoSkill.deleteMany({ where: { candidatoId: { in: candidatosIds } } });
  await prisma.vagaSkill.deleteMany({ where: { vagaId: { in: vagasIds } } });
  await prisma.vaga.deleteMany({ where: { id: { in: vagasIds } } });
  await prisma.candidato.deleteMany({ where: { id: { in: candidatosIds } } });
  await prisma.assinatura.deleteMany({ where: { OR: [{ empresaId: { in: todasEmpresasIds } }, { empresaRhId: { in: idsParaApagar.length ? undefined : [] } }] } });
  await prisma.empresa.deleteMany({ where: { id: { in: todasEmpresasIds } } });
  await prisma.empresaRh.deleteMany({ where: { usuarioId: { in: idsParaApagar } } });
  await prisma.usuario.deleteMany({ where: { id: { in: idsParaApagar } } });

  for (const usuario of usuariosParaApagar) {
    await supabaseAdmin.auth.admin.deleteUser(usuario.id);
  }

  console.log("Reset concluido. Apagadas", usuariosParaApagar.length, "contas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
