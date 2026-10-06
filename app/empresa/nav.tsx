"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";

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
        <Logo variante="branco" altura={18} />
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-[70vw] sm:max-w-none">
          <Link href="/empresa/vagas"
            className={"flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium transition " +
              (pathname.startsWith("/empresa/vagas") ? "bg-electric-yellow text-deep-black" : "text-gray-300 hover:text-white")}>
            <LayoutDashboard className="w-3.5 h-3.5" />
            Vagas
          </Link>
          <Link href="/empresa/candidatos"
            className={"flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium transition " +
              (pathname.startsWith("/empresa/candidatos") ? "bg-electric-yellow text-deep-black" : "text-gray-300 hover:text-white")}>
            Currículos
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