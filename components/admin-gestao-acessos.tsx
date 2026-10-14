"use client";

import { useState, useEffect } from "react";
import { Building2, CheckCircle } from "lucide-react";

type Empresa = {
  id: string;
  nomeFantasia: string;
  cnpj: string;
  status: "PENDENTE" | "APROVADA" | "REJEITADA";
};

export function AdminGestaoAcessos() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/admin/empresas/gestao")
      .then((res) => res.json())
      .then((data) => {
        // Filtra para manter APENAS as empresas que estão aprovadas
        const empresasAprovadas = (data.empresas || []).filter(
          (empresa: Empresa) => empresa.status === "APROVADA"
        );
        setEmpresas(empresasAprovadas);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  return (
    <div className="glass rounded-card p-6 border border-white mt-6">
      <h2 className="font-bold text-deep-black mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Empresas Ativas no Sistema
      </h2>
      
      {carregando ? (
        <p className="text-gray-500 text-sm">A carregar lista de empresas...</p>
      ) : empresas.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
          <p className="text-gray-500 text-sm">Nenhuma empresa aprovada no momento.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 font-medium">Empresa</th>
                <th className="pb-3 font-medium">CNPJ</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 font-medium text-deep-black">{empresa.nomeFantasia}</td>
                  <td className="py-3 text-gray-500">{empresa.cnpj}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center w-max gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Ativa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}