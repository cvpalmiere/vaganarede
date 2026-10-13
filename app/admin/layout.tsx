import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Aguarda a resolução dos cookies (Obrigatório no Next.js 15)
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

  // Busca o usuário valendo-se dos cookies injetados
  const { data: { user } } = await supabase.auth.getUser();

  // Verifica a existência do usuário e se o metadado corresponde a ADMIN
  if (!user || user.app_metadata?.tipo_usuario !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-off-white">
      <AdminNav />
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}