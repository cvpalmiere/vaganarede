"use client";

import { useEffect, useState } from "react";
import { Users, Building2, Briefcase, FileText, DollarSign, AlertTriangle } from "lucide-react";

type Metricas = {
  totalCandidatos: number;
  totalEmpresas: number;
  totalEmpresasRh: number;
  totalVagasAtivas: number;
  totalCandidaturas: number;
  assinaturasAtivas: number;
  assinaturasPendentes: number;
  assinaturasInadimplentes: number;
  mrr: number;
};

export default function PainelAdmin() {
  const [dados, setDados] = useState<Metricas | null>(null);

  useEffect(() => {
    fetch("/api/admin/metricas").then((r) => r.json()).then(setDados);
  }, []);

  if (!dados) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Painel Administrativo</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-deep-black rounded-card p-5 text-white">
          <DollarSign className="w-5 h-5 text-electric-yellow mb-3" />
          <p className="text-2xl font-bold">R$ {dados.mrr.toLocaleString("pt-BR")}</p>
          <p className="text-xs text-gray-400">MRR (assinaturas ativas)</p>
        </div>
        <div className="glass rounded-card p-5 border border-white">
          <Users className="w-5 h-5 text-gray-600 mb-3" />
          <p className="text-2xl font-bold text-deep-black">{dados.totalCandidatos}</p>
          <p className="text-xs text-gray-500">Candidatos</p>
        </div>
        <div className="glass rounded-card p-5 border border-white">
          <Building2 className="w-5 h-5 text-gray-600 mb-3" />
          <p className="text-2xl font-bold text-deep-black">{dados.totalEmpresas + dados.totalEmpresasRh}</p>
          <p className="text-xs text-gray-500">Empresas + RH</p>
        </div>
        <div className="glass rounded-card p-5 border border-white">
          <Briefcase className="w-5 h-5 text-gray-600 mb-3" />
          <p className="text-2xl font-bold text-deep-black">{dados.totalVagasAtivas}</p>
          <p className="text-xs text-gray-500">Vagas Ativas</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-card p-5 border border-white">
          <p className="text-xs text-gray-500 mb-1">Assinaturas Ativas</p>
          <p className="text-xl font-bold text-green-600">{dados.assinaturasAtivas}</p>
        </div>
        <div className="glass rounded-card p-5 border border-white">
          <p className="text-xs text-gray-500 mb-1">Pendentes de Pagamento</p>
          <p className="text-xl font-bold text-yellow-600">{dados.assinaturasPendentes}</p>
        </div>
        <div className="glass rounded-card p-5 border border-white flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Inadimplentes</p>
            <p className="text-xl font-bold text-red-600">{dados.assinaturasInadimplentes}</p>
          </div>
          {dados.assinaturasInadimplentes > 0 && <AlertTriangle className="w-5 h-5 text-red-500" />}
        </div>
      </div>

      <div className="glass rounded-card p-6 border border-white">
        <h2 className="font-bold text-deep-black mb-1 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Candidaturas no sistema
        </h2>
        <p className="text-3xl font-bold text-deep-black mt-2">{dados.totalCandidaturas}</p>
      </div>
    </div>
  );
}