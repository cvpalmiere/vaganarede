"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("vagas_cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("vagas_cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-deep-black text-white p-4 shadow-lg border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 lg:px-12">
      <p className="text-sm text-zinc-300">
        Utilizamos cookies essenciais para garantir o funcionamento da plataforma e autenticação segura. Para saber mais, consulte a nossa{" "}
        <Link href="/privacidade" className="underline text-yellow-300 font-medium">
          Política de Privacidade
        </Link>.
      </p>
      <button
        onClick={accept}
        className="bg-yellow-300 text-deep-black font-bold px-5 py-2 rounded-full text-sm whitespace-nowrap transition hover:opacity-90"
      >
        Entendi e Aceitar
      </button>
    </div>
  );
}