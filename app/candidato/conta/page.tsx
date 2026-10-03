"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, AlertTriangle } from "lucide-react";

export default function MinhaConta() {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function baixarDados() {
    const resposta = await fetch("/api/candidato/exportar-dados");
    const blob = await resposta.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meus-dados-vagasnarede.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function excluirConta() {
    setExcluindo(true);
    await fetch("/api/candidato/conta", { method: "DELETE" });
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Minha Conta</h1>

      <div className="glass rounded-card p-6 border border-white">
        <h2 className="font-bold text-deep-black mb-2 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar meus dados
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Baixe uma copia de tudo que temos sobre voce: dados pessoais, habilidades, documentos e candidaturas.
        </p>
        <button onClick={baixarDados} className="bg-deep-black text-white font-bold px-5 py-2.5 rounded-pill text-sm hover:bg-gray-900 transition">
          Baixar meus dados (.json)
        </button>
      </div>

      <div className="glass rounded-card p-6 border border-red-200 bg-red-50/50">
        <h2 className="font-bold text-red-700 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Excluir minha conta
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Remove permanentemente seu perfil, documentos, candidaturas e historico. Essa acao nao pode ser desfeita.
        </p>

        {!confirmando ? (
          <button onClick={() => setConfirmando(true)} className="flex items-center gap-2 border border-red-300 text-red-700 font-bold px-5 py-2.5 rounded-pill text-sm hover:bg-red-100 transition">
            <Trash2 className="w-4 h-4" />
            Quero excluir minha conta
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-700">Tem certeza? Essa acao e permanente.</p>
            <div className="flex gap-3">
              <button onClick={excluirConta} disabled={excluindo} className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-pill text-sm hover:bg-red-700 transition disabled:opacity-50">
                {excluindo ? "Excluindo..." : "Sim, excluir permanentemente"}
              </button>
              <button onClick={() => setConfirmando(false)} className="text-sm font-semibold text-gray-600">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}