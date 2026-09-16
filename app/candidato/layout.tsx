import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CandidatoNav } from "@/components/candidato-nav";

export default async function CandidatoLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "CANDIDATO") redirect("/login");

  return (
    <div className="min-h-screen bg-off-white">
      <CandidatoNav />
      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}