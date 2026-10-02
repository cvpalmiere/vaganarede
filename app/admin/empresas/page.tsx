"use client";

import { useEffect, useState } from "react";

type Empresa = { id: string; razaoSocial: string; aprovado: boolean; usuario: { email: string } };

export default function EmpresasAdmin() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresasRh, setEmpresasRh] = useState<Empresa[]>([]);

  function carregar() {
    fetch("/api/admin/empresas").then((r) => r.json()).then((d) => {
      setEmpresas(d.empresas || []);
      setEmpresasRh(d.empresasRh || []);
    });
  }

  useEffect(carregar, []);

  async function alterar(tipo: "EMPRESA" | "EMPRESA_RH", id: string, aprovado: boolean) {
    await fetch("/api/admin/empresas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, id, aprovado }),
    });
    carregar();
  }

  function Lista({ titulo, itens, tipo }: { titulo: string; itens: Empresa[]; tipo: "EMPRESA" | "EMPRESA_RH" }) {
    return (
      <div className="glass rounded-card border border-white overflow-hidden">
        <h2 className="font-bold text-deep-black p-4 border-b border-gray-200">{titulo}</h2>
        {itens.length === 0 ? (
          <p className="text-gray-500 text-sm p-4">Nenhuma cadastrada.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <tbody>
              {itens.map((e) => (
                <tr key={e.id} className="border-b border-gray-100 last:border-0">
                  <td className="p-4">
                    <p className="font-medium text-deep-black">{e.razaoSocial}</p>
                    <p className="text-xs text-gray-500">{e.usuario.email}</p>
                  </td>
                  <td className="p-4 text-right">
                    {e.aprovado ? (
                      <button onClick={() => alterar(tipo, e.id, false)} className="text-xs font-bold px-3 py-1.5 rounded-pill bg-green-100 text-green-700">
                        Aprovada
                      </button>
                    ) : (
                      <button onClick={() => alterar(tipo, e.id, true)} className="text-xs font-bold px-3 py-1.5 rounded-pill bg-electric-yellow text-deep-black">
                        Aprovar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Aprovação de Empresas</h1>
      <Lista titulo="Empresas" itens={empresas} tipo="EMPRESA" />
      <Lista titulo="Empresas de RH" itens={empresasRh} tipo="EMPRESA_RH" />
    </div>
  );
}