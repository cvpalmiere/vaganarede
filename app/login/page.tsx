"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

const ROTA_POR_TIPO: Record<string, string> = {
  CANDIDATO: "/candidato",
  EMPRESA: "/empresa",
  EMPRESA_RH: "/rh",
  ADMIN: "/admin",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const resposta = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      setErro(dados.erro ?? "Falha ao entrar");
      setCarregando(false);
      return;
    }

    router.push(ROTA_POR_TIPO[dados.tipo] ?? "/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-deep-black text-white flex items-center justify-center px-6">
      <div className="glass-dark p-8 md:p-10 rounded-card border border-gray-800 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Entrar</h1>
        <p className="text-gray-400 text-sm mb-8">Acesse sua conta no Vagas na Rede.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-deep-black border border-gray-800 text-white px-5 py-4 rounded-lg focus:outline-none focus:border-electric-yellow transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-deep-black border border-gray-800 text-white px-5 py-4 rounded-lg focus:outline-none focus:border-electric-yellow transition"
            />
          </div>

          {erro && <p className="text-sm text-red-400">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-electric-yellow text-deep-black font-bold py-4 rounded-lg hover:bg-electric-yellow-dark transition disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link
          href={"https://wa.me/" + process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-electric-yellow transition"
        >
          <MessageCircle className="w-4 h-4" />
          Ainda nao tem conta? Fale com a gente
        </Link>
      </div>
    </div>
  );
}
