import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CandidatoNav } from "@/components/candidato-nav";

export default async function CandidatoLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "CANDIDATO") redirect("/login");

  return (
    <div className="min-h-screen bg-off-white">
      <CandidatoNav />
      {/* max-w-7xl garante que a tela é preenchida corretamente em monitores grandes */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}