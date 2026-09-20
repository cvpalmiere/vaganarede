"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle, Sparkles, FileText, LogOut, Search } from "lucide-react";
import { Logo } from "@/components/logo";

const ITENS = [
  { href: "/candidato", label: "Painel", icon: UserCircle },
  { href: "/candidato/perfil", label: "Perfil", icon: UserCircle },
  { href: "/candidato/skills", label: "Habilidades", icon: Sparkles },
  { href: "/candidato/vagas", label: "Vagas", icon: Search },
  { href: "/candidato/documentos", label: "Documentos", icon: FileText },
];

export function CandidatoNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-deep-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo variante="branco" altura={18} />
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