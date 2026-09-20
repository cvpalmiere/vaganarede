import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RhNav } from "@/components/rh-nav";

export default async function RhLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA_RH") redirect("/login");

  const empresaRh = await prisma.empresaRh.findUnique({
    where: { usuarioId: usuario.id },
    include: { assinatura: true },
  });

  if (empresaRh?.assinatura?.status !== "ATIVO") redirect("/rh/assinatura");

  return (
    <div className="min-h-screen bg-off-white">
      <RhNav />
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}