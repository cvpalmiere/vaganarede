"use client";

import { useState } from "react";
import { UserCircle, Sparkles, Briefcase, ClipboardList, Users, LayoutGrid, Network, Building2, Activity } from "lucide-react";

const ABAS = [
  { id: "estudante", label: "Estudante" },
  { id: "empresa", label: "Empresa" },
  { id: "agencia", label: "Empresa de RH" },
] as const;

type Aba = (typeof ABAS)[number]["id"];

export function HeroPreview() {
  const [aba, setAba] = useState<Aba>("estudante");

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative rounded-4xl border border-white/15 bg-white/4.5 p-4 shadow-2xl backdrop-blur-md sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="yellow-dot h-2.5 w-2.5 rounded-full bg-electric-yellow" />
            <span className="text-xs font-semibold uppercase tracking-[.16em] text-zinc-400">Visão geral</span>
          </div>
          <div className="flex rounded-xl border border-white/15 bg-black/20 p-1">
            {ABAS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAba(item.id)}
                className={
                  "rounded-lg px-3 py-2 text-xs font-bold transition " +
                  (aba === item.id ? "bg-electric-yellow text-deep-black" : "text-zinc-300 hover:text-white")
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {aba === "estudante" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="dashboard-card col-span-2 rounded-2xl p-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-400">Resumo do perfil</p>
                  <p className="mt-1 text-xl font-bold tracking-tight">Perfil em construção</p>
                </div>
                <div className="rounded-xl bg-electric-yellow p-2 text-deep-black">
                  <UserCircle className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 metric-line" />
              <p className="mt-3 text-xs text-zinc-400">Progresso do cadastro</p>
            </div>
            <div className="dashboard-card rounded-2xl p-4 text-white">
              <Sparkles className="h-4 w-4 text-electric-yellow" />
              <p className="mt-4 text-sm font-semibold">Competências cadastradas</p>
              <p className="mt-1 text-xs text-zinc-400">Skills e experiências organizadas.</p>
            </div>
            <div className="dashboard-card rounded-2xl p-4 text-white">
              <Briefcase className="h-4 w-4 text-electric-yellow" />
              <p className="mt-4 text-sm font-semibold">Vagas recomendadas</p>
              <p className="mt-1 text-xs text-zinc-400">Oportunidades alinhadas ao perfil.</p>
            </div>
          </div>
        )}

        {aba === "empresa" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="dashboard-card col-span-2 rounded-2xl p-5 text-white">
              <ClipboardList className="h-5 w-5 text-electric-yellow" />
              <p className="mt-4 text-xl font-bold">Publicação de vagas</p>
              <p className="mt-1 text-xs text-zinc-400">Crie e organize oportunidades em um só lugar.</p>
            </div>
            <div className="dashboard-card rounded-2xl p-4 text-white">
              <Users className="h-4 w-4 text-electric-yellow" />
              <p className="mt-4 text-sm font-semibold">Candidatos recebidos</p>
              <p className="mt-1 text-xs text-zinc-400">Perfis prontos para avaliação.</p>
            </div>
            <div className="dashboard-card rounded-2xl p-4 text-white">
              <LayoutGrid className="h-4 w-4 text-electric-yellow" />
              <p className="mt-4 text-sm font-semibold">Processo seletivo</p>
              <p className="mt-1 text-xs text-zinc-400">Etapas claras para o seu time.</p>
            </div>
          </div>
        )}

        {aba === "agencia" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="dashboard-card col-span-2 rounded-2xl p-5 text-white">
              <Network className="h-5 w-5 text-electric-yellow" />
              <p className="mt-4 text-xl font-bold">Painel master</p>
              <p className="mt-1 text-xs text-zinc-400">Uma visão conectada de toda a operação.</p>
            </div>
            <div className="dashboard-card rounded-2xl p-4 text-white">
              <Building2 className="h-4 w-4 text-electric-yellow" />
              <p className="mt-4 text-sm font-semibold">Clientes</p>
              <p className="mt-1 text-xs text-zinc-400">Contexto e acesso por conta.</p>
            </div>
            <div className="dashboard-card rounded-2xl p-4 text-white">
              <Activity className="h-4 w-4 text-electric-yellow" />
              <p className="mt-4 text-sm font-semibold">Vagas em andamento</p>
              <p className="mt-1 text-xs text-zinc-400">Processos por cliente.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}