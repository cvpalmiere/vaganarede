"use client";

import { useState } from "react";

type Categoria = "candidato" | "empresa" | "agencia";

const RECURSOS: Record<Categoria, { titulo: string; texto: string }[]> = {
  candidato: [
    { titulo: "Visibilidade do status", texto: "Acompanhe cada etapa da sua candidatura em tempo real." },
    { titulo: "Linguagem clara", texto: "Sem jargao tecnico - informacao direta em cada tela." },
    { titulo: "Controle total do perfil", texto: "Edite, atualize ou remova seus dados quando quiser." },
    { titulo: "Consistencia", texto: "A mesma acao sempre gera o mesmo resultado, em qualquer tela." },
    { titulo: "Prevencao de erros", texto: "Validacoes no cadastro evitam dados incorretos antes de enviar." },
    { titulo: "Sugestoes inteligentes", texto: "Skills e vagas sugeridas, sem precisar decorar nada." },
  ],
  empresa: [
    { titulo: "Publicacao agil de vagas", texto: "Preencha os campos fixos e a vaga vai ao ar na hora." },
    { titulo: "Design sem ruido", texto: "So o que importa pra tomar decisao de contratacao." },
    { titulo: "Mensagens de erro claras", texto: "Voce sabe exatamente o que corrigir quando algo falha." },
    { titulo: "Banco de curriculos ranqueado", texto: "Candidatos ordenados por compatibilidade com a vaga." },
    { titulo: "Painel corporativo", texto: "Visao consolidada de todas as vagas ativas." },
    { titulo: "Liberacao automatica de acesso", texto: "Pagou, ativou - sem espera manual de aprovacao." },
  ],
  agencia: [
    { titulo: "Painel master", texto: "Veja todas as empresas-cliente em um so lugar." },
    { titulo: "Gestao multi-cliente", texto: "Cada empresa-cliente com seu proprio espaco organizado." },
    { titulo: "Vagas por cliente", texto: "Nenhuma vaga se mistura com outro contexto." },
    { titulo: "Acompanhamento de processos", texto: "Veja o andamento de cada selecao, por cliente." },
    { titulo: "Organizacao de candidatos", texto: "Encontre perfis com facilidade entre multiplas vagas." },
    { titulo: "Visao consolidada", texto: "Decisoes com contexto de toda a operacao." },
  ],
};

const CATEGORIAS: { id: Categoria; titulo: string; subtitulo: string }[] = [
  { id: "candidato", titulo: "Candidato", subtitulo: "Encontre sua proxima oportunidade." },
  { id: "empresa", titulo: "Empresa", subtitulo: "Contrate com mais clareza." },
  { id: "agencia", titulo: "Empresa de RH", subtitulo: "Conecte toda a operacao." },
];

export function FeatureAccordion() {
  const [aberta, setAberta] = useState<Categoria>("candidato");

  return (
    <div className="rounded-[2rem] bg-[#171717] p-3 shadow-2xl sm:p-5">
      <div className="grid gap-3">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setAberta(cat.id)}
            className={
              "accordion-card rounded-2xl p-5 text-left text-white transition hover:-translate-y-0.5 " +
              (aberta === cat.id ? "is-open border border-electric-yellow/70 bg-white/10" : "border border-white/10")
            }
          >
            <span className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-lg font-bold">{cat.titulo}</span>
                <span className="mt-1 block text-sm text-zinc-400">{cat.subtitulo}</span>
              </span>
              <span className="accordion-mark">+</span>
            </span>

            {aberta === cat.id && (
              <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                {RECURSOS[cat.id].map((item) => (
                  <div key={item.titulo} className="dashboard-card rounded-2xl p-4 text-left">
                    <p className="font-bold text-white">{item.titulo}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
