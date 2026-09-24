import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "ADMIN") redirect("/login");

  return (
    <div className="min-h-screen bg-off-white">
      <AdminNav />
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}