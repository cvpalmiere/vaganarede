"use client";

import { useEffect, useState } from "react";

type Assinatura = {
  id: string;
  plano: string;
  status: string;
  criadoEm: string;
  empresa: { razaoSocial: string } | null;
  empresaRh: { razaoSocial: string } | null;
};

const STATUS_COR: Record<string, string> = {
  ATIVO: "bg-green-100 text-green-700",
  PENDENTE: "bg-yellow-100 text-yellow-700",
  CANCELADO: "bg-gray-100 text-gray-600",
  INADIMPLENTE: "bg-red-100 text-red-700",
};

export default function AssinaturasAdmin() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/admin/assinaturas")
      .then((r) => r.json())
      .then((data) => {
        setAssinaturas(data.assinaturas || []);
        setCarregando(false);
      });
  }, []);

  if (carregando) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-deep-black">Assinaturas</h1>

      <div className="glass rounded-card border border-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="p-4">Empresa</th>
              <th className="p-4">Plano</th>
              <th className="p-4">Status</th>
              <th className="p-4">Desde</th>
            </tr>
          </thead>
          <tbody>
            {assinaturas.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 last:border-0">
                <td className="p-4 font-medium text-deep-black">
                  {a.empresa?.razaoSocial || a.empresaRh?.razaoSocial || "-"}
                </td>
                <td className="p-4 text-gray-600">{a.plano}</td>
                <td className="p-4">
                  <span className={"text-xs font-bold px-2.5 py-1 rounded-pill " + (STATUS_COR[a.status] || "bg-gray-100")}>
                    {a.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{new Date(a.criadoEm).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
