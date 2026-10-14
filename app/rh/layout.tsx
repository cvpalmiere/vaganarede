import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { RhNav } from "@/components/rh-nav";

export default async function RhLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // 1. Verifica a chave de acesso do Supabase
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.tipo_usuario !== "EMPRESA_RH") {
    redirect("/login");
  }

  // 2. Busca o registo no banco de dados usando a relação 1:1 correta
  const empresaRh = await prisma.empresaRh.findUnique({ 
    where: { usuarioId: user.id } 
  });

  // 3. Trava de Segurança Final: Lê o booleano diretamente do seu schema
  if (empresaRh && empresaRh.aprovado === false) {
    redirect("/pendente-aprovacao");
  }

  // Se passou por tudo e aprovado === true, carrega o painel com a navegação do RH
  return (
    <div className="min-h-screen bg-off-white">
      <RhNav />
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}