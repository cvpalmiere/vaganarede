"use client";

import { useState, useEffect } from "react";
import { Building2, Trash2 } from "lucide-react";

type Empresa = {
  id: string;
  nomeFantasia: string;
  cnpj: string;
  status: "PENDENTE" | "APROVADA" | "REJEITADA";
};

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/admin/empresas/gestao")
      .then((res) => res.json())
      .then((data) => {
        // Mostra APENAS as que estão aprovadas e ativas no sistema
        const aprovadas = (data.empresas || []).filter((e: Empresa) => e.status === "APROVADA");
        setEmpresas(aprovadas);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  const excluirEmpresa = async (id: string) => {
    if (!confirm("Tem a certeza que deseja excluir esta empresa definitivamente? Todos os dados vinculados serão apagados.")) return;
    
    // Oculta imediatamente da lista
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
    
    try {
        const response = await fetch("/api/admin/empresas/gestao", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
            alert("Empresa excluída com sucesso.");
        } else {
            alert("Erro ao excluir base de dados.");
        }
    } catch {
        alert("Erro de comunicação.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Empresas Registadas</h1>

      <div className="glass rounded-card p-6 border border-white">
        <h2 className="font-bold text-deep-black mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Lista de Empresas Ativas
        </h2>
        
        {carregando ? (
          <p className="text-gray-500 text-sm">A carregar registos...</p>
        ) : empresas.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Não há empresas ativas no sistema de momento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="pb-3 font-medium">Nome / Razão Social</th>
                  <th className="pb-3 font-medium">CNPJ</th>
                  <th className="pb-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-medium text-deep-black">{empresa.nomeFantasia}</td>
                    <td className="py-3 text-gray-500">{empresa.cnpj}</td>
                    <td className="py-3 flex justify-end">
                      <button onClick={() => excluirEmpresa(empresa.id)} title="Excluir Empresa" className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1">
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
    </div>
  );
}