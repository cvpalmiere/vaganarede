"use client";

import { useEffect, useState } from "react";

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

  if (carregando) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-deep-black">Usuários</h1>
        <span className="text-sm text-gray-500">{usuarios.length} no total (últimos 100)</span>
      </div>

      <div className="glass rounded-card border border-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="p-4">E-mail</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0">
                <td className="p-4 text-deep-black">{u.email}</td>
                <td className="p-4">
                  <span className={"text-xs font-bold px-2.5 py-1 rounded-pill " + (TIPO_COR[u.tipo] || "bg-gray-100")}>
                    {u.tipo}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{new Date(u.criadoEm).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
