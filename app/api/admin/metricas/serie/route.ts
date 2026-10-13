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

  // 3. Execução das queries Prisma (Inalterado)
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

  const candidatos = await prisma.candidato.findMany({
    where: { criadoEm: { gte: seteDiasAtras } },
    select: { criadoEm: true },
  });
  const candidaturas = await prisma.candidatura.findMany({
    where: { criadaEm: { gte: seteDiasAtras } },
    select: { criadaEm: true },
  });

  const dias: { data: string; candidatos: number; candidaturas: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dia = new Date();
    dia.setDate(dia.getDate() - i);
    const chave = dia.toISOString().slice(0, 10);
    dias.push({
      data: chave,
      candidatos: candidatos.filter((c) => c.criadoEm.toISOString().slice(0, 10) === chave).length,
      candidaturas: candidaturas.filter((c) => c.criadaEm.toISOString().slice(0, 10) === chave).length,
    });
  }

  return NextResponse.json({ dias });
}