"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

type Match = { vagaId: string; titulo: string; empresa: string; cidade: string; score: number };

export default function VagasRecomendadas() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/candidato/matches")
      .then((r) => r.json())
      .then((data) => {
        setMatches(data.matches || []);
        setCarregando(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-black flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-electric-yellow" />
          Vagas Recomendadas
        </h1>
        <p className="text-gray-500 text-sm mt-1">Ordenadas pelo seu score de compatibilidade real.</p>
      </div>

      {carregando ? (
        <p className="text-gray-500">Calculando compatibilidade...</p>
      ) : matches.length === 0 ? (
        <div className="glass rounded-card p-10 border border-white text-center">
          <p className="text-gray-500">Nenhuma vaga ativa no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => (
            <Link key={m.vagaId} href={`/candidato/vagas/${m.vagaId}`} className="glass rounded-card p-5 border border-white hover:border-electric-yellow transition flex items-center justify-between">
              <div>
                <p className="font-semibold text-deep-black">{m.titulo}</p>
                <p className="text-xs text-gray-500">{m.empresa} · {m.cidade}</p>
              </div>
              <span className={"text-sm font-bold px-3 py-1.5 rounded-pill " + (m.score >= 70 ? "bg-green-100 text-green-700" : m.score >= 40 ? "bg-electric-yellow/20 text-deep-black" : "bg-gray-100 text-gray-600")}>
                {m.score}% match
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}