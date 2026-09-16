import Link from "next/link";
import { UserCircle, Sparkles, FileText, Inbox } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, string> = {
  ENVIADA: "Enviada",
  EM_ANALISE: "Em analise",
  ENTREVISTA: "Entrevista",
  OFERTA: "Oferta",
  REJEITADA: "Nao seguiu",
};

export default async function PainelCandidato() {
  const usuario = await getSessionUser();
  const candidato = await prisma.candidato.findUnique({ where: { usuarioId: usuario!.id } });

  const candidaturas = candidato
    ? await prisma.candidatura.findMany({
        where: { candidatoId: candidato.id },
        include: { vaga: { include: { empresa: true } } },
        orderBy: { criadaEm: "desc" },
        take: 5,
      })
    : [];

  const completude = candidato?.completudePerfil ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-black">Bem-vindo(a) de volta</h1>
        <p className="text-gray-500">Complete seu perfil para aparecer nas vagas certas.</p>
      </div>

      <div className="glass rounded-card p-6 border border-white">
        <div className="flex justify-between items-end mb-2">
          <p className="text-sm font-medium text-gray-600">Completude do perfil</p>
          <span className="text-xl font-bold text-deep-black">{completude}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-pill h-2">
          <div className="bg-electric-yellow h-2 rounded-pill" style={{ width: completude + "%" }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/candidato/perfil" className="glass rounded-card p-6 border border-white hover:border-electric-yellow transition">
          <UserCircle className="w-6 h-6 text-deep-black mb-3" />
          <h3 className="font-bold text-deep-black text-sm">Completar Perfil</h3>
          <p className="text-xs text-gray-500 mt-1">Telefone, cidade e links profissionais.</p>
        </Link>
        <Link href="/candidato/skills" className="glass rounded-card p-6 border border-white hover:border-electric-yellow transition">
          <Sparkles className="w-6 h-6 text-deep-black mb-3" />
          <h3 className="font-bold text-deep-black text-sm">Habilidades</h3>
          <p className="text-xs text-gray-500 mt-1">Adicione as skills que você domina.</p>
        </Link>
        <Link href="/candidato/documentos" className="glass rounded-card p-6 border border-white hover:border-electric-yellow transition">
          <FileText className="w-6 h-6 text-deep-black mb-3" />
          <h3 className="font-bold text-deep-black text-sm">Documentos</h3>
          <p className="text-xs text-gray-500 mt-1">Envie seus documentos para verificação.</p>
        </Link>
      </div>

      <div className="glass rounded-card p-6 border border-white">
        <h2 className="font-bold text-deep-black mb-4">Suas Candidaturas</h2>
        {candidaturas.length === 0 ? (
          <div className="text-center py-8">
            <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Você ainda não se candidatou a nenhuma vaga.</p>
            <p className="text-xs text-gray-400 mt-1">Assim que a busca de vagas estiver disponível, elas aparecem aqui.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {candidaturas.map((c) => (
              <div key={c.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-3 last:border-0">
                <div>
                  <p className="font-semibold text-deep-black">{c.vaga.titulo}</p>
                  <p className="text-xs text-gray-500">{c.vaga.empresa.razaoSocial}</p>
                </div>
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-pill">
                  {STATUS_LABEL[c.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}