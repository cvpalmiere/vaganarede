"use client";

import { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";

type EmpresaCliente = {
  id: string;
  razaoSocial: string;
  cidade: string;
  _count: { vagas: number };
};

export default function EmpresasCliente() {
  const [empresas, setEmpresas] = useState<EmpresaCliente[]>([]);
  const [form, setForm] = useState({ razaoSocial: "", cnpj: "", telefone: "", cidade: "" });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  function carregar() {
    fetch("/api/rh/empresas-cliente")
      .then((r) => r.json())
      .then((data) => setEmpresas(data.empresasCliente || []));
  }

  useEffect(carregar, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro("");

    const resposta = await fetch("/api/rh/empresas-cliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const dados = await resposta.json();
    setEnviando(false);

    if (!resposta.ok) {
      setErro(dados.erro ?? "Erro ao criar empresa-cliente");
      return;
    }

    setForm({ razaoSocial: "", cnpj: "", telefone: "", cidade: "" });
    setMostrarForm(false);
    carregar();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-deep-black">Empresas-Cliente</h1>
        <button onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 bg-electric-yellow text-deep-black font-bold px-5 py-2.5 rounded-pill hover:bg-electric-yellow-dark transition">
          <Plus className="w-4 h-4" />
          Nova Empresa-Cliente
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={criar} className="glass rounded-card p-6 border border-white space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Razão Social</label>
            <input required value={form.razaoSocial} onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
              className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CNPJ</label>
            <input required value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="Somente números"
              className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</label>
            <input required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cidade</label>
            <input required value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              className="w-full mt-1 bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
          </div>
          {erro && <p className="text-sm text-red-500">{erro}</p>}
          <button type="submit" disabled={enviando}
            className="bg-deep-black text-white font-bold px-6 py-3 rounded-pill hover:bg-gray-900 transition disabled:opacity-50">
            {enviando ? "Criando..." : "Criar"}
          </button>
        </form>
      )}

      {empresas.length === 0 ? (
        <div className="glass rounded-card p-10 border border-white text-center">
          <p className="text-gray-500">Nenhuma empresa-cliente cadastrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {empresas.map((e) => (
            <div key={e.id} className="glass rounded-card p-5 border border-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-semibold text-deep-black">{e.razaoSocial}</p>
                  <p className="text-xs text-gray-500">{e.cidade}</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-pill text-gray-600">
                {e._count.vagas} vaga(s)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}