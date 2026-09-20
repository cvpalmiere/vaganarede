import { notFound } from "next/navigation";
import { MapPin, Building2, Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { CandidatarButton } from "@/components/candidatar-button";

const NIVEL_LABEL: Record<string, string> = { ESTAGIO: "Estágio", TRAINEE: "Trainee", JUNIOR: "Júnior", PLENO: "Pleno", SENIOR: "Sênior" };
const MODELO_LABEL: Record<string, string> = { REMOTO: "Remoto", HIBRIDO: "Híbrido", PRESENCIAL: "Presencial" };
const FAIXA_LABEL: Record<string, string> = {
  ATE_2000: "Até R$ 2.000", DE_2000_A_4000: "R$ 2.000 a R$ 4.000", DE_4000_A_6000: "R$ 4.000 a R$ 6.000",
  DE_6000_A_10000: "R$ 6.000 a R$ 10.000", ACIMA_DE_10000: "Acima de R$ 10.000", A_COMBINAR: "A combinar",
};

export default async function DetalheVaga({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vaga = await prisma.vaga.findUnique({
    where: { id },
    include: { empresa: { select: { razaoSocial: true } }, skills: { include: { skill: true } } },
  });

  if (!vaga || vaga.status !== "ATIVA") notFound();

  const usuario = await getSessionUser();
  const candidato = usuario ? await prisma.candidato.findUnique({ where: { usuarioId: usuario.id } }) : null;
  const jaCandidatado = candidato
    ? await prisma.candidatura.findUnique({ where: { candidatoId_vagaId: { candidatoId: candidato.id, vagaId: vaga.id } } })
    : null;

  return (
    <div className="glass rounded-card p-6 border border-white">
      <h1 className="text-2xl font-bold text-deep-black">{vaga.titulo}</h1>
      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
        <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{vaga.empresa.razaoSocial}</span>
        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{vaga.cidade}</span>
        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{NIVEL_LABEL[vaga.nivel]}</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-pill text-gray-700">{MODELO_LABEL[vaga.modelo]}</span>
        <span className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-pill text-gray-700">{FAIXA_LABEL[vaga.faixaSalarial]}</span>
        <span className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-pill text-gray-700">{vaga.area}</span>
      </div>

      <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">{vaga.descricao}</p>

      {vaga.skills.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills desejadas</p>
          <div className="flex flex-wrap gap-2">
            {vaga.skills.map((vs) => (
              <span key={vs.skillId} className="bg-deep-black text-white text-xs px-3 py-1.5 rounded-pill">{vs.skill.nome}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {jaCandidatado ? (
          <p className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-3 rounded-lg inline-block">
            Você já se candidatou a esta vaga.
          </p>
        ) : (
          <CandidatarButton vagaId={vaga.id} />
        )}
      </div>
    </div>
  );
}