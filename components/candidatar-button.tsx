"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CandidatarButton({ vagaId }: { vagaId: string }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function candidatar() {
    setEnviando(true);
    setMensagem("");

    const resposta = await fetch("/api/candidato/candidaturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vagaId }),
    });
    const dados = await resposta.json();
    setEnviando(false);

    if (!resposta.ok) {
      setMensagem(dados.erro ?? "Erro ao se candidatar");
      return;
    }

    setEnviado(true);
    router.refresh();
  }

  if (enviado) {
    return (
      <p className="text-sm font-semibold text-green-700 bg-green-50 px-4 py-3 rounded-lg inline-block">
        Candidatura enviada com sucesso.
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={candidatar}
        disabled={enviando}
        className="bg-electric-yellow text-deep-black font-bold px-8 py-3.5 rounded-pill hover:bg-electric-yellow-dark transition disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Candidatar-se"}
      </button>
      {mensagem && <p className="text-sm text-red-500 mt-2">{mensagem}</p>}
    </div>
  );
}