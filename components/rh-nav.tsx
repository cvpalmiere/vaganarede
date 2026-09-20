"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Building2, Briefcase } from "lucide-react";
import { Logo } from "@/components/logo";

export function RhNav() {
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
        <Logo variante="branco" altura={18} />
        <div className="flex items-center gap-1">
          <Link href="/rh/empresas-cliente"
            className={"flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium transition " +
              (pathname.startsWith("/rh/empresas-cliente") ? "bg-electric-yellow text-deep-black" : "text-gray-300 hover:text-white")}>
            <Building2 className="w-3.5 h-3.5" />
            Clientes
          </Link>
          <Link href="/rh/vagas"
            className={"flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium transition " +
              (pathname.startsWith("/rh/vagas") ? "bg-electric-yellow text-deep-black" : "text-gray-300 hover:text-white")}>
            <Briefcase className="w-3.5 h-3.5" />
            Vagas
          </Link>
          <button onClick={sair} className="flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium text-gray-400 hover:text-white transition">
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}