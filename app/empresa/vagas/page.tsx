export const dynamic = "force-dynamic";

import Link from "next/link";
import { Briefcase, Plus, List } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export default async function VagasEmpresaPage() {
  const usuario = await getSessionUser();
  const empresaDb = usuario ? await prisma.empresa.findUnique({ where: { usuarioId: usuario.id } }) : null;
  const vagas = empresaDb ? await prisma.vaga.findMany({ where: { empresaId: empresaDb.id } }) : [];

  return (
    <div className="space-y-6">
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
          {/* Aqui entrará o mapeamento das vagas no futuro */}
          <p className="text-gray-500 text-sm">Tem {vagas.length} vaga(s) publicada(s).</p>
        </div>
      )}
    </div>
  );
}