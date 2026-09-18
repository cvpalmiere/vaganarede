import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmpresaNav } from "@/app/empresa/nav";

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA") redirect("/login");

  const empresa = await prisma.empresa.findUnique({
    where: { usuarioId: usuario.id },
    include: { assinatura: true },
  });

  if (empresa?.assinatura?.status !== "ATIVO") redirect("/empresa/assinatura");

  return (
    <div className="min-h-screen bg-off-white">
      <EmpresaNav />
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
