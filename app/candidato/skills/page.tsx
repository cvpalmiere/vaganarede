"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type CandidatoSkill = {
  skillId: string;
  nivel: number;
  skill: { nome: string };
};

export default function SkillsCandidato() {
  const [skills, setSkills] = useState<CandidatoSkill[]>([]);
  const [nome, setNome] = useState("");
  const [nivel, setNivel] = useState(3);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  function carregar() {
    fetch("/api/candidato/skills")
      .then((r) => r.json())
      .then((data) => {
        setSkills(data.skills || []);
        setCarregando(false);
      });
  }

  useEffect(carregar, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setEnviando(true);

    await fetch("/api/candidato/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, nivel }),
    });

    setNome("");
    setNivel(3);
    setEnviando(false);
    carregar();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Suas Habilidades</h1>

      <form onSubmit={adicionar} className="glass rounded-card p-6 border border-white flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Habilidade</label>
          <input
            type="text"
            placeholder="Ex: React, Excel, Ingles"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow"
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nivel (1-5)</label>
          <select
            value={nivel}
            onChange={(e) => setNivel(Number(e.target.value))}
            className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={enviando}
          className="bg-deep-black text-white font-bold px-6 py-3 rounded-pill hover:bg-gray-900 transition disabled:opacity-50 whitespace-nowrap"
        >
          Adicionar
        </button>
      </form>

      {carregando ? (
        <p className="text-gray-500">Carregando...</p>
      ) : skills.length === 0 ? (
        <p className="text-gray-500">Nenhuma habilidade cadastrada ainda.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.skillId}
              className="bg-deep-black text-white text-sm px-4 py-2 rounded-pill flex items-center gap-2"
            >
              {s.skill.nome}
              <span className="bg-electric-yellow text-deep-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {s.nivel}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}