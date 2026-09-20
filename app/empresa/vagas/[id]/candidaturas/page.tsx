"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserCircle } from "lucide-react";

type Candidatura = {
  id: string;
  status: string;
  scoreCompatibilidade: number;
  criadaEm: string;
  candidato: {
    nomeCompleto: string;
    cidade: string;
    completudePerfil: number;
    skills: { nivel: number; skill: { nome: string } }[];
  };
};

const STATUS_OPCOES = ["ENVIADA", "EM_ANALISE", "ENTREVISTA", "OFERTA", "REJEITADA"];
const STATUS_LABEL: Record<string, string> = {
  ENVIADA: "Enviada",
  EM_ANALISE: "Em analise",
  ENTREVISTA: "Entrevista",
  OFERTA: "Oferta",
  REJEITADA: "Rejeitada",
};

export default function CandidaturasDaVaga() {
  const params = useParams();
  const vagaId = params.id as string;

  const [vagaTitulo, setVagaTitulo] = useState("");
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [carregando, setCarregando] = useState(true);

  function carregar() {
    fetch(`/api/empresa/vagas/${vagaId}/candidaturas`)
      .then((r) => r.json())
      .then((data) => {
        setVagaTitulo(data.vaga?.titulo ?? "");
        setCandidaturas(data.candidaturas || []);
        setCarregando(false);
      });
  }

  useEffect(carregar, [vagaId]);

  async function mudarStatus(candidaturaId: string, status: string) {
    await fetch(`/api/empresa/vagas/${vagaId}/candidaturas`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidaturaId, status }),
    });
    carregar();
  }

  if (carregando) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-black">Candidaturas</h1>
        <p className="text-gray-500 text-sm">{vagaTitulo}</p>
      </div>

      {candidaturas.length === 0 ? (
        <div className="glass rounded-card p-10 border border-white text-center">
          <p className="text-gray-500">Nenhuma candidatura recebida ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidaturas.map((c) => (
            <div key={c.id} className="glass rounded-card p-5 border border-white">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <UserCircle className="w-8 h-8 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-deep-black">{c.candidato.nomeCompleto}</p>
                    <p className="text-xs text-gray-500">
                      {c.candidato.cidade || "Cidade nao informada"} · Perfil {c.candidato.completudePerfil}% completo
                    </p>
                    {c.candidato.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.candidato.skills.map((s) => (
                          <span key={s.skill.nome} className="text-xs bg-gray-100 px-2 py-0.5 rounded-pill text-gray-600">
                            {s.skill.nome}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <select
                  value={c.status}
                  onChange={(e) => mudarStatus(c.id, e.target.value)}
                  className="text-xs font-bold bg-white border border-gray-200 px-3 py-2 rounded-pill focus:outline-none focus:border-electric-yellow"
                >
                  {STATUS_OPCOES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}