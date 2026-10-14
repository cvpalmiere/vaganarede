import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // 1. Verifica se o utilizador tem a chave de acesso
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.tipo_usuario !== "EMPRESA") {
    redirect("/login");
  }

  // 2. Busca a empresa usando o ID do utilizador (forma correta para a sua relação 1:1)
  const empresaDb = await prisma.empresa.findUnique({
    where: { usuarioId: user.id } 
  });

  // 3. Trava de Segurança Final: Lê o booleano diretamente do seu schema
  if (empresaDb && empresaDb.aprovado === false) {
    redirect("/pendente-aprovacao");
  }

  // Se passou por tudo e aprovado === true, carrega o painel
  return (
    <div className="min-h-screen bg-off-white">
      {children}
    </div>
  );
}