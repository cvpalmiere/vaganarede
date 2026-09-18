"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, LayoutDashboard, ClipboardList, Users, Settings, LogOut } from "lucide-react";

const ITENS = [
  { href: "/empresa", label: "Painel", icon: LayoutDashboard },
  { href: "/empresa/vagas", label: "Vagas", icon: ClipboardList },
  { href: "/empresa/candidatos", label: "Candidatos", icon: Users },
  { href: "/empresa/configuracoes", label: "Configurações", icon: Settings },
];

export function EmpresaNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-deep-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-electric-yellow rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-deep-black" />
          </div>
          <span className="font-bold text-sm">Painel da Empresa</span>
        </div>
        <div className="flex items-center gap-1">
          {ITENS.map((item) => {
            const Icone = item.icon;
            const ativo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium transition " +
                  (ativo ? "bg-electric-yellow text-deep-black" : "text-gray-300 hover:text-white")
                }
              >
                <Icone className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={sair}
            className="flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium text-gray-400 hover:text-white transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}