"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, CreditCard, Users } from "lucide-react";
import { Logo } from "@/components/logo";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const itens = [
    { href: "/admin", label: "Painel", icon: LayoutDashboard },
    { href: "/admin/assinaturas", label: "Assinaturas", icon: CreditCard },
    { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  ];

  return (
    <nav className="bg-deep-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo variante="branco" altura={18} />
        <div className="flex items-center gap-1">
          {itens.map((item) => {
            const Icone = item.icon;
            const ativo = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={"flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium transition " +
                  (ativo ? "bg-electric-yellow text-deep-black" : "text-gray-300 hover:text-white")}>
                <Icone className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
          <button onClick={sair} className="flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium text-gray-400 hover:text-white transition">
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}