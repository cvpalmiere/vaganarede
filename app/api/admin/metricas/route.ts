import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  // 1. Leitura assíncrona de cookies obrigatória no Next.js 15
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  );

  // 2. Validação direta e segura da sessão
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.tipo_usuario !== "ADMIN") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  // 3. Execução das queries Prisma
  const [totalCandidatos, totalEmpresas, totalEmpresasRh, totalVagasAtivas, totalCandidaturas, assinaturasAtivas, assinaturasPendentes, assinaturasInadimplentes] = await Promise.all([
    prisma.candidato.count(),
    prisma.empresa.count(),
    prisma.empresaRh.count(),
    prisma.vaga.count({ where: { status: "ATIVA" } }),
    prisma.candidatura.count(),
    prisma.assinatura.count({ where: { status: "ATIVO" } }),
    prisma.assinatura.count({ where: { status: "PENDENTE" } }),
    prisma.assinatura.count({ where: { status: "INADIMPLENTE" } }),
  ]);

  const [ativosEmpresa, ativosRh] = await Promise.all([
    prisma.assinatura.count({ where: { status: "ATIVO", plano: "EMPRESA" } }),
    prisma.assinatura.count({ where: { status: "ATIVO", plano: "EMPRESA_RH" } }),
  ]);
  const mrr = ativosEmpresa * 299 + ativosRh * 899;

  return NextResponse.json({
    totalCandidatos,
    totalEmpresas,
    totalEmpresasRh,
    totalVagasAtivas,
    totalCandidaturas,
    assinaturasAtivas,
    assinaturasPendentes,
    assinaturasInadimplentes,
    mrr,
  });
}