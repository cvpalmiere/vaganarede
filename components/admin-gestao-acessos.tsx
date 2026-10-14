"use client";

import { useState, useEffect } from "react";
import { Building2, CheckCircle, XCircle } from "lucide-react";

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
        // Mostra APENAS as que estão pendentes de aprovação
        const pendentes = (data.empresas || []).filter((e: Empresa) => e.status === "PENDENTE");
        setEmpresas(pendentes);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  const atualizarStatus = async (id: string, novoStatus: "APROVADA" | "REJEITADA") => {
    // Remove da tela imediatamente (já que deixou de ser pendente)
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
    
    try {
        const response = await fetch("/api/admin/empresas/gestao", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: novoStatus }),
        });

        if (response.ok) {
            alert(novoStatus === "APROVADA" ? "Empresa aprovada e movida para a aba Empresas!" : "Empresa rejeitada.");
        } else {
            alert("Erro ao atualizar base de dados.");
        }
    } catch {
        alert("Erro de comunicação.");
    }
  };

  return (
    <div className="glass rounded-card p-6 border border-white mt-6">
      <h2 className="font-bold text-deep-black mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Aprovações Pendentes
      </h2>
      
      {carregando ? (
        <p className="text-gray-500 text-sm">A procurar aprovações pendentes...</p>
      ) : empresas.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
          <p className="text-gray-500 text-sm">Tudo limpo! Não há empresas a aguardar aprovação.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 font-medium">Empresa</th>
                <th className="pb-3 font-medium">CNPJ</th>
                <th className="pb-3 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 font-medium text-deep-black">{empresa.nomeFantasia}</td>
                  <td className="py-3 text-gray-500">{empresa.cnpj}</td>
                  <td className="py-3 flex justify-end gap-2">
                    <button onClick={() => atualizarStatus(empresa.id, "APROVADA")} title="Aprovar" className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => atualizarStatus(empresa.id, "REJEITADA")} title="Rejeitar" className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <XCircle className="w-4 h-4" />
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