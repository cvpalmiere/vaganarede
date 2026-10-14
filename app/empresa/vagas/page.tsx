export const dynamic = "force-dynamic";

import Link from "next/link";
import { Briefcase, Plus, List, ChevronRight, Users, MapPin, DollarSign, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export default async function VagasEmpresaPage() {
  const usuario = await getSessionUser();
  const empresaDb = usuario ? await prisma.empresa.findUnique({ where: { usuarioId: usuario.id } }) : null;
  // Busca as vagas e conta as candidaturas de cada uma
  const vagas = empresaDb ? await prisma.vaga.findMany({
    where: { empresaId: empresaDb.id },
    orderBy: { criadoEm: 'desc' },
    include: { _count: { select: { candidaturas: true } } }
  }) : [];

  return (
    // Adicionado max-w-6xl e mx-auto para não colar nas bordas do ecrã
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Navbar Interna / Toolbar de Gestão */}
      <div className="glass rounded-xl border border-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-deep-black text-white rounded-xl flex items-center justify-center shadow-inner">
            <List className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-deep-black leading-tight">Gestão de Vagas</h1>
            <p className="text-sm text-gray-500">Administre as suas oportunidades publicadas</p>
          </div>
        </div>

        <Link
          href="/empresa/vagas/nova"
          className="bg-electric-yellow text-deep-black px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Publicar Nova Vaga
        </Link>
      </div>

      {/* Empty State */}
      {vagas.length === 0 ? (
        <div className="glass rounded-card border border-white p-12 flex flex-col items-center justify-center text-center mt-2">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm border border-gray-100">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-deep-black mb-2">Nenhuma vaga ativa</h3>
          <p className="text-gray-500 max-w-md mb-6 text-sm">
            Ainda não publicou nenhuma oportunidade na plataforma. Crie a sua primeira vaga para começar a atrair e receber candidaturas de grandes talentos.
          </p>
          <Link
            href="/empresa/vagas/nova"
            className="bg-deep-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar a minha primeira vaga
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 mt-4">
           {vagas.map((vaga) => (
             <div key={vaga.id} className="glass rounded-card border border-white p-6 shadow-sm hover:shadow-md transition-shadow group">
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                 
                 {/* Lado Esquerdo: Detalhes da Vaga */}
                 <div className="flex-1 space-y-4">
                   <div>
                     <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          vaga.status === "ATIVA" ? "bg-green-100 text-green-700" :
                          vaga.status === "PAUSADA" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {vaga.status}
                        </span>
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(vaga.criadoEm).toLocaleDateString('pt-BR')}
                        </span>
                     </div>
                     <h3 className="text-xl font-bold text-deep-black group-hover:text-blue-600 transition-colors">
                       {vaga.titulo}
                     </h3>
                   </div>

                   <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                     <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{vaga.modelo}</span>
                     </div>
                     <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{vaga.nivel}</span>
                     </div>
                   </div>
                 </div>

                 {/* Lado Direito: Ações e Métricas */}
                 <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                   <div className="text-center px-4">
                     <p className="text-3xl font-black text-deep-black tracking-tight">{vaga._count.candidaturas}</p>
                     <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mt-1 flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" /> Candidatos
                     </p>
                   </div>
                   
                   <div className="flex flex-col gap-2">
                     <Link
                        href={`/empresa/vagas/${vaga.id}/candidaturas`}
                        className="bg-deep-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors text-center shadow-sm"
                     >
                       Ver Candidaturas
                     </Link>
                     <Link
                        href={`/empresa/vagas/${vaga.id}`}
                        className="bg-white border border-gray-200 text-deep-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors text-center flex items-center justify-center gap-1"
                     >
                       Detalhes da Vaga <ChevronRight className="w-4 h-4" />
                     </Link>
                   </div>
                 </div>

               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}