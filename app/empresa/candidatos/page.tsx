"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UserCircle, MapPin } from "lucide-react";

type Candidato = {
  id: string;
  nomeCompleto: string;
  cidade: string;
  completudePerfil: number;
  scoreProvisorio: number;
  skills: { nivel: number; skill: { nome: string } }[];
};

export default function BancoDeCurriculos() {
  const searchParams = useSearchParams();
  const vagaId = searchParams.get("vagaId") ?? "";

  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [cidade, setCidade] = useState("");
  const [carregando, setCarregando] = useState(true);

  function buscar() {
    setCarregando(true);
    const params = new URLSearchParams();
    if (vagaId) params.set("vagaId", vagaId);
    if (cidade) params.set("cidade", cidade);

    fetch("/api/empresa/candidatos?" + params.toString())
      .then((r) => r.json())
      .then((data) => {
        setCandidatos(data.candidatos || []);
        setCarregando(false);
      });
  }

  useEffect(buscar, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-black">Banco de Currículos</h1>
        {vagaId && (
          <p className="text-xs text-gray-500 mt-1">
            Ranqueado por compatibilidade de skills com a vaga selecionada (score provisório — o motor completo chega em breve).
          </p>
        )}
      </div>

      <div className="glass rounded-card p-5 border border-white flex gap-3">
        <input
          placeholder="Filtrar por cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="flex-1 bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-electric-yellow"
        />
        <button onClick={buscar} className="bg-deep-black text-white font-bold px-6 py-2.5 rounded-pill text-sm hover:bg-gray-900 transition">
          Buscar
        </button>
      </div>

      {carregando ? (
        <p className="text-gray-500">Carregando...</p>
      ) : candidatos.length === 0 ? (
        <div className="glass rounded-card p-10 border border-white text-center">
          <p className="text-gray-500">Nenhum candidato encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidatos.map((c) => (
            <div key={c.id} className="glass rounded-card p-5 border border-white flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <UserCircle className="w-8 h-8 text-gray-400 shrink-0" />
                <div>
                  <p className="font-semibold text-deep-black">{c.nomeCompleto}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {c.cidade || "Cidade nao informada"} · Perfil {c.completudePerfil}%
                  </p>
                  {c.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {c.skills.map((s) => (
                        <span key={s.skill.nome} className="text-xs bg-gray-100 px-2 py-0.5 rounded-pill text-gray-600">
                          {s.skill.nome}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {vagaId && (
                <span className="text-xs font-bold bg-electric-yellow/20 text-deep-black px-3 py-1.5 rounded-pill whitespace-nowrap">
                  {c.scoreProvisorio}% match
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}