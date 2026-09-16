"use client";

import { useEffect, useState } from "react";

export default function PerfilCandidato() {
  const [dados, setDados] = useState({
    telefone: "",
    cidade: "",
    linkedinUrl: "",
    githubUrl: "",
    resumoProfissional: "",
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("/api/candidato/perfil")
      .then((r) => r.json())
      .then((data) => {
        if (data.candidato) {
          setDados({
            telefone: data.candidato.telefone || "",
            cidade: data.candidato.cidade || "",
            linkedinUrl: data.candidato.linkedinUrl || "",
            githubUrl: data.candidato.githubUrl || "",
            resumoProfissional: data.candidato.resumoProfissional || "",
          });
        }
        setCarregando(false);
      });
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");

    const resposta = await fetch("/api/candidato/perfil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    setSalvando(false);
    setMensagem(resposta.ok ? "Perfil atualizado com sucesso." : "Erro ao salvar. Tenta de novo.");
  }

  if (carregando) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Seu Perfil</h1>

      <form onSubmit={salvar} className="glass rounded-card p-6 border border-white space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</label>
          <input
            type="tel"
            value={dados.telefone}
            onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cidade</label>
          <input
            type="text"
            value={dados.cidade}
            onChange={(e) => setDados({ ...dados, cidade: e.target.value })}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">LinkedIn</label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/seu-perfil"
            value={dados.linkedinUrl}
            onChange={(e) => setDados({ ...dados, linkedinUrl: e.target.value })}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">GitHub</label>
          <input
            type="url"
            placeholder="https://github.com/seu-usuario"
            value={dados.githubUrl}
            onChange={(e) => setDados({ ...dados, githubUrl: e.target.value })}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resumo profissional</label>
          <textarea
            rows={4}
            value={dados.resumoProfissional}
            onChange={(e) => setDados({ ...dados, resumoProfissional: e.target.value })}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow"
          />
        </div>

        {mensagem && <p className="text-sm text-gray-600">{mensagem}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="bg-deep-black text-white font-bold px-6 py-3 rounded-pill hover:bg-gray-900 transition disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar Perfil"}
        </button>
      </form>
    </div>
  );
}