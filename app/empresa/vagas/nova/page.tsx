"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AREAS = ["TI", "SAUDE", "ADMINISTRATIVO", "COMERCIAL", "MARKETING", "FINANCEIRO", "RH", "ENGENHARIA", "OUTROS"];
const NIVEIS = ["ESTAGIO", "TRAINEE", "JUNIOR", "PLENO", "SENIOR"];
const MODELOS = ["REMOTO", "HIBRIDO", "PRESENCIAL"];
const FAIXAS = [
  { value: "ATE_2000", label: "Até R$ 2.000" },
  { value: "DE_2000_A_4000", label: "R$ 2.000 a R$ 4.000" },
  { value: "DE_4000_A_6000", label: "R$ 4.000 a R$ 6.000" },
  { value: "DE_6000_A_10000", label: "R$ 6.000 a R$ 10.000" },
  { value: "ACIMA_DE_10000", label: "Acima de R$ 10.000" },
  { value: "A_COMBINAR", label: "A combinar" },
];

export default function NovaVaga() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "", descricao: "", area: "TI", nivel: "PLENO", modelo: "REMOTO",
    faixaSalarial: "A_COMBINAR", cidade: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  function atualizar(campo: string, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function publicar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setEnviando(true);

    // geocodificacao real (transformar cidade em lat/lng) entra no Dia 10 junto com a busca por raio -
    // por enquanto grava 0,0 como placeholder valido pro schema, sem quebrar o fluxo de criacao
    const resposta = await fetch("/api/empresa/vagas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, latitude: 0, longitude: 0 }),
    });
    const dados = await resposta.json();

    setEnviando(false);
    if (!resposta.ok) {
      setErro(dados.erro ?? "Erro ao publicar vaga");
      return;
    }

    router.push("/empresa/vagas");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Publicar Nova Vaga</h1>

      <form onSubmit={publicar} className="glass rounded-card p-6 border border-white space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Título da vaga</label>
          <input required value={form.titulo} onChange={(e) => atualizar("titulo", e.target.value)}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</label>
          <textarea required rows={5} value={form.descricao} onChange={(e) => atualizar("descricao", e.target.value)}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Área</label>
            <select value={form.area} onChange={(e) => atualizar("area", e.target.value)}
              className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow">
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nível</label>
            <select value={form.nivel} onChange={(e) => atualizar("nivel", e.target.value)}
              className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow">
              {NIVEIS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Modelo</label>
            <select value={form.modelo} onChange={(e) => atualizar("modelo", e.target.value)}
              className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow">
              {MODELOS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Faixa Salarial</label>
            <select value={form.faixaSalarial} onChange={(e) => atualizar("faixaSalarial", e.target.value)}
              className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow">
              {FAIXAS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cidade</label>
          <input required value={form.cidade} onChange={(e) => atualizar("cidade", e.target.value)}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
        </div>

        {erro && <p className="text-sm text-red-500">{erro}</p>}

        <button type="submit" disabled={enviando}
          className="bg-deep-black text-white font-bold px-6 py-3 rounded-pill hover:bg-gray-900 transition disabled:opacity-50">
          {enviando ? "Publicando..." : "Publicar Vaga"}
        </button>
      </form>
    </div>
  );
}