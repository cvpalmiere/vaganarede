"use client";

import { useState, useEffect } from "react";
import { Building2, CheckCircle, XCircle, Trash2 } from "lucide-react";

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
        setEmpresas(data.empresas || []);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  const atualizarStatus = async (id: string, novoStatus: string) => {
    setEmpresas((prev) => prev.filter((e) => e.id !== id || novoStatus !== "EXCLUIDA"));
    await fetch("/api/admin/empresas/gestao", {
      method: novoStatus === "EXCLUIDA" ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: novoStatus }),
    });
  };

  return (
    <div className="glass rounded-card p-6 border border-white mt-6">
      <h2 className="font-bold text-deep-black mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Gestão de Acessos & Aprovações
      </h2>
      
      {carregando ? (
        <p className="text-gray-500 text-sm">A carregar lista de empresas...</p>
      ) : empresas.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
          <p className="text-gray-500 text-sm">A API de gestão ainda não foi conectada ou não há empresas pendentes.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 font-medium">Empresa</th>
                <th className="pb-3 font-medium">CNPJ</th>
                <th className="pb-3 font-medium">Status Atual</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 font-medium text-deep-black">{empresa.nomeFantasia}</td>
                  <td className="py-3 text-gray-500">{empresa.cnpj}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      empresa.status === "PENDENTE" ? "bg-yellow-100 text-yellow-800" :
                      empresa.status === "APROVADA" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {empresa.status}
                    </span>
                  </td>
                  <td className="py-3 flex justify-end gap-2">
                    {empresa.status !== "APROVADA" && (
                      <button onClick={() => atualizarStatus(empresa.id, "APROVADA")} title="Aprovar" className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {empresa.status !== "REJEITADA" && (
                      <button onClick={() => atualizarStatus(empresa.id, "REJEITADA")} title="Negar/Bloquear" className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => atualizarStatus(empresa.id, "EXCLUIDA")} title="Excluir Definitivamente" className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
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