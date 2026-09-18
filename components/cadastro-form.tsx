"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserCircle, Building2, Network, ArrowRight } from "lucide-react";

type TipoUsuario = "CANDIDATO" | "EMPRESA" | "EMPRESA_RH";

export function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [etapa, setEtapa] = useState<1 | 2>(searchParams.get("tipo") ? 2 : 1);
  const [tipo, setTipo] = useState<TipoUsuario>((searchParams.get("tipo") as TipoUsuario) || "CANDIDATO");
  
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const formData = new FormData(e.currentTarget);
    const dados = Object.fromEntries(formData.entries());
    dados.tipo = tipo;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.erro || "Erro ao criar conta");
      }

      if (tipo === "CANDIDATO") {
        router.push("/candidato");
      } else {
        router.push("/empresa/assinatura");
      }
    } catch (error: any) {
      setErro(error.message);
      setLoading(false);
    }
  }

  if (etapa === 1) {
    return (
      <div className="w-full max-w-md mx-auto mt-6">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Como você deseja usar a rede?</h1>
        <p className="text-center text-zinc-400 mb-8">Selecione seu perfil para iniciar o cadastro.</p>
        
        <div className="space-y-4">
          <button onClick={() => { setTipo("CANDIDATO"); setEtapa(2); }} className="w-full flex items-center justify-between p-5 border border-white/10 rounded-2xl hover:border-yellow-400 transition bg-[#18181b] shadow-sm text-left group">
            <div className="flex items-center gap-4">
              <div className="bg-black text-electric-yellow p-3 rounded-xl border border-white/10"><UserCircle className="w-6 h-6" /></div>
              <div><p className="font-bold text-white group-hover:text-yellow-300 transition">Sou Estudante</p><p className="text-sm text-zinc-400">Quero buscar vagas e cadastrar meu currículo.</p></div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-yellow-300 transition" />
          </button>

          <button onClick={() => { setTipo("EMPRESA"); setEtapa(2); }} className="w-full flex items-center justify-between p-5 border border-white/10 rounded-2xl hover:border-yellow-400 transition bg-[#18181b] shadow-sm text-left group">
            <div className="flex items-center gap-4">
              <div className="bg-electric-yellow text-black p-3 rounded-xl"><Building2 className="w-6 h-6" /></div>
              <div><p className="font-bold text-white group-hover:text-yellow-300 transition">Sou Empresa</p><p className="text-sm text-zinc-400">Quero publicar vagas e contratar talentos.</p></div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-yellow-300 transition" />
          </button>

          <button onClick={() => { setTipo("EMPRESA_RH"); setEtapa(2); }} className="w-full flex items-center justify-between p-5 border border-white/10 rounded-2xl hover:border-yellow-400 transition bg-[#18181b] shadow-sm text-left group">
            <div className="flex items-center gap-4">
              <div className="bg-black text-electric-yellow p-3 rounded-xl border border-white/10"><Network className="w-6 h-6" /></div>
              <div><p className="font-bold text-white group-hover:text-yellow-300 transition">Sou Agência de RH</p><p className="text-sm text-zinc-400">Gerencio processos para múltiplos clientes.</p></div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-yellow-300 transition" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#18181b] border border-white/10 rounded-2xl shadow-xl text-white">
      <button onClick={() => setEtapa(1)} className="text-sm text-zinc-400 hover:text-yellow-300 mb-6 flex items-center gap-1 transition">
        ← Voltar e mudar perfil
      </button>
      
      <h2 className="text-2xl font-bold mb-6 text-white">
        {tipo === "CANDIDATO" ? "Cadastro de Estudante" : "Cadastro Corporativo"}
      </h2>

      {erro && <p className="mb-4 text-sm text-red-400 bg-red-950/50 p-3 rounded-lg border border-red-800">{erro}</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-300">Nome {tipo === "CANDIDATO" ? "Completo" : "da Empresa"}</label>
          <input name="nome" type="text" required className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-300">E-mail</label>
          <input name="email" type="email" required className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-300">Senha</label>
          <input name="senha" type="password" required minLength={8} className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" />
        </div>

        {tipo === "CANDIDATO" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">CPF</label>
              <input name="cpf" type="text" required maxLength={14} className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Nível de Escolaridade</label>
              <select name="escolaridade" required className="w-full p-3 bg-[#222] border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none">
                <option value="" className="bg-[#18181b]">Selecione...</option>
                <option value="Ensino Medio" className="bg-[#18181b]">Ensino Médio</option>
                <option value="Tecnico" className="bg-[#18181b]">Técnico</option>
                <option value="Superior Incompleto" className="bg-[#18181b]">Superior Incompleto</option>
                <option value="Superior Completo" className="bg-[#18181b]">Superior Completo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Curso</label>
              <input name="curso" type="text" required placeholder="Ex: Engenharia de Software" className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none placeholder:text-zinc-600" />
            </div>
          </>
        )}

        {tipo !== "CANDIDATO" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">CNPJ</label>
              <input name="cnpj" type="text" required maxLength={18} className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Telefone / WhatsApp</label>
              <input name="telefone" type="text" required className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Cidade Sede</label>
              <input name="cidade" type="text" required className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" />
            </div>
          </>
        )}

        <button disabled={loading} className="w-full mt-4 bg-electric-yellow text-deep-black font-bold py-3.5 rounded-pill transition hover:-translate-y-0.5 disabled:opacity-50">
          {loading ? "Processando..." : "Criar Conta"}
        </button>
      </form>
    </div>
  );
}