"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react"; // Adicionado ícone de exclusão

type Usuario = { id: string; email: string; tipo: string; criadoEm: string };

const TIPO_COR: Record<string, string> = {
  CANDIDATO: "bg-blue-100 text-blue-700",
  EMPRESA: "bg-purple-100 text-purple-700",
  EMPRESA_RH: "bg-orange-100 text-orange-700",
  ADMIN: "bg-electric-yellow/30 text-deep-black",
};

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/admin/usuarios")
      .then((r) => r.json())
      .then((data) => {
        setUsuarios(data.usuarios || []);
        setCarregando(false);
      });
  }, []);

  // NOVA FUNÇÃO: Aciona a API de exclusão e remove da tela
  const excluirUsuario = async (id: string) => {
    if (!confirm("Tem a certeza que deseja excluir este usuário definitivamente?")) return;

    // Remove da interface imediatamente (Optimistic UI)
    setUsuarios((prev) => prev.filter((u) => u.id !== id));

    try {
      const response = await fetch("/api/admin/usuarios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        alert("Erro ao excluir do banco de dados.");
      }
    } catch {
      alert("Erro de comunicação com o servidor.");
    }
  };

  if (carregando) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-deep-black">Usuários</h1>
        <span className="text-sm text-gray-500">{usuarios.length} no total (últimos 100)</span>
      </div>

      <div className="glass rounded-card border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <th className="p-4">E-mail</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Cadastro</th>
                <th className="p-4 text-right">Ação</th> {/* Coluna Nova */}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-deep-black">{u.email}</td>
                  <td className="p-4">
                    <span className={"text-xs font-bold px-2.5 py-1 rounded-pill " + (TIPO_COR[u.tipo] || "bg-gray-100")}>
                      {u.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(u.criadoEm).toLocaleDateString("pt-BR")}</td>
                  <td className="p-4 flex justify-end">
                    {/* Botão de Excluir Novo */}
                    <button
                      onClick={() => excluirUsuario(u.id)}
                      title="Excluir Usuário"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}