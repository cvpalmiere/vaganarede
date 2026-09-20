"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Building2 } from "lucide-react";

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

type Vaga = {
  id: string;
  titulo: string;
  cidade: string;
  modelo: string;
  nivel: string;
  area: string;
  empresa: { razaoSocial: string };
};

export default function BuscaVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState({ area: "", nivel: "", modelo: "", faixaSalarial: "", cidade: "" });

  function buscar() {
    setCarregando(true);
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor) params.set(chave, valor);
    });

    fetch("/api/vagas?" + params.toString())
      .then((r) => r.json())
      .then((data) => {
        setVagas(data.vagas || []);
        setCarregando(false);
      });
  }

  useEffect(buscar, []);

  function atualizar(campo: string, valor: string) {
    setFiltros((atual) => ({ ...atual, [campo]: valor }));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Buscar Vagas</h1>

      <div className="glass rounded-card p-5 border border-white grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select value={filtros.area} onChange={(e) => atualizar("area", e.target.value)}
          className="bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-electric-yellow">
          <option value="">Área</option>
          {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filtros.nivel} onChange={(e) => atualizar("nivel", e.target.value)}
          className="bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-electric-yellow">
          <option value="">Nível</option>
          {NIVEIS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={filtros.modelo} onChange={(e) => atualizar("modelo", e.target.value)}
          className="bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-electric-yellow">
          <option value="">Modelo</option>
          {MODELOS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filtros.faixaSalarial} onChange={(e) => atualizar("faixaSalarial", e.target.value)}
          className="bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-electric-yellow">
          <option value="">Salário</option>
          {FAIXAS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <input placeholder="Cidade" value={filtros.cidade} onChange={(e) => atualizar("cidade", e.target.value)}
          className="bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-electric-yellow" />
      </div>

      <button onClick={buscar} className="bg-deep-black text-white font-bold px-6 py-2.5 rounded-pill text-sm hover:bg-gray-900 transition">
        Filtrar
      </button>

      {carregando ? (
        <p className="text-gray-500">Carregando...</p>
      ) : vagas.length === 0 ? (
        <div className="glass rounded-card p-10 border border-white text-center">
          <p className="text-gray-500">Nenhuma vaga encontrada com esses filtros.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vagas.map((v) => (
            <Link key={v.id} href={"/candidato/vagas/" + v.id} className="block glass rounded-card p-5 border border-white hover:border-electric-yellow transition">
              <p className="font-semibold text-deep-black">{v.titulo}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{v.empresa.razaoSocial}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{v.cidade}</span>
                <span>{v.modelo}</span>
                <span>{v.nivel}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}