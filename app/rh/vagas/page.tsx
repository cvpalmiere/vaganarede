import Link from "next/link";
import { Plus } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function VagasDaRh() {
  const usuario = await getSessionUser();
  const empresaRh = await prisma.empresaRh.findUnique({ where: { usuarioId: usuario!.id } });

  const vagas = empresaRh
    ? await prisma.vaga.findMany({
        where: { empresa: { empresaRhId: empresaRh.id } },
        include: { empresa: { select: { razaoSocial: true } } },
        orderBy: { criadoEm: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-deep-black">Vagas dos Clientes</h1>
        <Link href="/rh/vagas/nova" className="flex items-center gap-2 bg-electric-yellow text-deep-black font-bold px-5 py-2.5 rounded-pill hover:bg-electric-yellow-dark transition">
          <Plus className="w-4 h-4" />
          Nova Vaga
        </Link>
      </div>

      {vagas.length === 0 ? (
        <div className="glass rounded-card p-10 border border-white text-center">
          <p className="text-gray-500">Nenhuma vaga publicada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vagas.map((v) => (
            <div key={v.id} className="glass rounded-card p-5 border border-white flex justify-between items-center">
              <div>
                <p className="font-semibold text-deep-black">{v.titulo}</p>
                <p className="text-xs text-gray-500">{v.empresa.razaoSocial} · {v.cidade} · {v.modelo}</p>
              </div>
              <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-pill text-gray-600">{v.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}