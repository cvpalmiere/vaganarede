"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Briefcase, Users, TrendingUp } from "lucide-react";

type Dashboard = {
  totalClientes: number;
  totalVagas: number;
  vagasAtivas: number;
  totalCandidaturas: number;
  resumoPorCliente: { id: string; razaoSocial: string; totalVagas: number; totalCandidaturas: number }[];
};

export default function PainelRh() {
  const [dados, setDados] = useState<Dashboard | null>(null);

  useEffect(() => {
    fetch("/api/rh/dashboard")
      .then((r) => r.json())
      .then(setDados);
  }, []);

  if (!dados) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Painel Master</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-deep-black rounded-card p-5 text-white">
          <Building2 className="w-5 h-5 text-electric-yellow mb-3" />
          <p className="text-2xl font-bold">{dados.totalClientes}</p>
          <p className="text-xs text-gray-400">Empresas-Cliente</p>
        </div>
        <div className="glass rounded-card p-5 border border-white">
          <Briefcase className="w-5 h-5 text-gray-600 mb-3" />
          <p className="text-2xl font-bold text-deep-black">{dados.vagasAtivas}</p>
          <p className="text-xs text-gray-500">Vagas Ativas</p>
        </div>
        <div className="glass rounded-card p-5 border border-white">
          <TrendingUp className="w-5 h-5 text-gray-600 mb-3" />
          <p className="text-2xl font-bold text-deep-black">{dados.totalVagas}</p>
          <p className="text-xs text-gray-500">Vagas Totais</p>
        </div>
        <div className="glass rounded-card p-5 border border-white">
          <Users className="w-5 h-5 text-gray-600 mb-3" />
          <p className="text-2xl font-bold text-deep-black">{dados.totalCandidaturas}</p>
          <p className="text-xs text-gray-500">Candidaturas</p>
        </div>
      </div>

      <div className="glass rounded-card p-6 border border-white">
        <h2 className="font-bold text-deep-black mb-4">Resumo por Cliente</h2>
        {dados.resumoPorCliente.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma empresa-cliente cadastrada ainda.</p>
        ) : (
          <div className="space-y-2">
            {dados.resumoPorCliente.map((c) => (
              <div key={c.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-3 last:border-0">
                <span className="font-semibold text-deep-black">{c.razaoSocial}</span>
                <span className="text-xs text-gray-500">{c.totalVagas} vaga(s) · {c.totalCandidaturas} candidatura(s)</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/rh/empresas-cliente" className="inline-block text-sm font-semibold text-deep-black hover:text-electric-yellow-dark transition">
        Gerenciar empresas-cliente →
      </Link>
    </div>
  );
}