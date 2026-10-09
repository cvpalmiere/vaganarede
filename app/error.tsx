"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function ErroGlobal({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // registra no Sentry (configurado logo abaixo) - nao expoe stack trace pro usuario final
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-deep-black text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <Logo variante="branco" altura={22} />
      </div>
      <p className="text-red-400 font-bold text-sm mb-2">ALGO DEU ERRADO</p>
      <h1 className="text-3xl font-bold mb-3">Tivemos um problema inesperado</h1>
      <p className="text-zinc-400 mb-8 max-w-md">
        Nossa equipe ja foi notificada automaticamente. Tenta de novo em alguns instantes.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="bg-electric-yellow text-deep-black font-bold px-6 py-3 rounded-pill hover:-translate-y-0.5 transition">
          Tentar de novo
        </button>
        <Link href="/" className="border border-white/20 text-white px-6 py-3 rounded-pill hover:border-electric-yellow transition">
          Voltar para a home
        </Link>
      </div>
    </div>
  );
}
