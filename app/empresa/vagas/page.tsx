export const dynamic = "force-dynamic"; // Esta linha obriga o servidor a gerar a página de fresco!

import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export default async function VagasEmpresaPage() {
  const usuario = await getSessionUser();
  const empresaDb = usuario ? await prisma.empresa.findUnique({ where: { usuarioId: usuario.id } }) : null;
  const vagas = empresaDb ? await prisma.vaga.findMany({ where: { empresaId: empresaDb.id } }) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-deep-black">Suas Vagas</h1>
        <Link
          href="/empresa/vagas/nova"
          className="bg-electric-yellow text-deep-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nova Vaga
        </Link>
      </div>

      {vagas.length === 0 ? (
        <div className="glass rounded-card border border-white p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-deep-black mb-2">Nenhuma vaga publicada</h3>
          <p className="text-gray-500 max-w-md mb-6 text-sm">
            Ainda não publicou nenhuma oportunidade na plataforma. Crie a sua primeira vaga para começar a atrair e receber candidaturas de grandes talentos.
          </p>
          <Link
            href="/empresa/vagas/nova"
            className="bg-deep-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Publicar Primeira Vaga
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <p className="text-gray-500 text-sm">Tem {vagas.length} vaga(s) publicada(s).</p>
        </div>
      )}
    </div>
  );
}