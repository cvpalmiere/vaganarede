"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserCircle, Building2, Network, ArrowRight } from "lucide-react";

type TipoUsuario = "CANDIDATO" | "EMPRESA" | "EMPRESA_RH";

export function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Etapa 1 = Escolha do Perfil | Etapa 2 = Formulário de Dados
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
    
    // Injeta o tipo escolhido na etapa 1
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

      // Redirecionamento baseado no perfil (Product-Led vs Paywall)
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
      <div className="w-full max-w-md mx-auto mt-20">
        <h1 className="text-3xl font-bold text-center text-deep-black mb-2">Como você deseja usar a rede?</h1>
        <p className="text-center text-zinc-500 mb-8">Selecione seu perfil para iniciar o cadastro.</p>
        
        <div className="space-y-4">
          <button onClick={() => { setTipo("CANDIDATO"); setEtapa(2); }} className="w-full flex items-center justify-between p-5 border rounded-2xl hover:border-yellow-400 transition bg-white shadow-sm text-left">
            <div className="flex items-center gap-4">
              <div className="bg-black text-electric-yellow p-3 rounded-xl"><UserCircle className="w-6 h-6" /></div>
              <div><p className="font-bold text-deep-black">Sou Estudante</p><p className="text-sm text-zinc-500">Quero buscar vagas e cadastrar meu currículo.</p></div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-300" />
          </button>

          <button onClick={() => { setTipo("EMPRESA"); setEtapa(2); }} className="w-full flex items-center justify-between p-5 border rounded-2xl hover:border-yellow-400 transition bg-white shadow-sm text-left">
            <div className="flex items-center gap-4">
              <div className="bg-electric-yellow text-black p-3 rounded-xl"><Building2 className="w-6 h-6" /></div>
              <div><p className="font-bold text-deep-black">Sou Empresa</p><p className="text-sm text-zinc-500">Quero publicar vagas e contratar talentos.</p></div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-300" />
          </button>

          <button onClick={() => { setTipo("EMPRESA_RH"); setEtapa(2); }} className="w-full flex items-center justify-between p-5 border rounded-2xl hover:border-yellow-400 transition bg-white shadow-sm text-left">
            <div className="flex items-center gap-4">
              <div className="bg-black text-electric-yellow p-3 rounded-xl"><Network className="w-6 h-6" /></div>
              <div><p className="font-bold text-deep-black">Sou Agência de RH</p><p className="text-sm text-zinc-500">Gerencio processos para múltiplos clientes.</p></div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white border rounded-2xl shadow-sm">
      <button onClick={() => setEtapa(1)} className="text-sm text-zinc-500 hover:text-black mb-6 flex items-center gap-1">
        Voltar e mudar perfil
      </button>
      
      <h2 className="text-2xl font-bold mb-6 text-deep-black">
        {tipo === "CANDIDATO" ? "Cadastro de Estudante" : "Cadastro Corporativo"}
      </h2>

      {erro && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{erro}</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome {tipo === "CANDIDATO" ? "Completo" : "da Empresa"}</label>
          <input name="nome" type="text" required className="w-full p-3 border rounded-xl" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input name="email" type="email" required className="w-full p-3 border rounded-xl" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input name="senha" type="password" required minLength={8} className="w-full p-3 border rounded-xl" />
        </div>

        {tipo === "CANDIDATO" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <input name="cpf" type="text" required maxLength={14} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nível de Escolaridade</label>
              <select name="escolaridade" required className="w-full p-3 border rounded-xl bg-white">
                <option value="">Selecione...</option>
                <option value="Ensino Medio">Ensino Médio</option>
                <option value="Tecnico">Técnico</option>
                <option value="Superior Incompleto">Superior Incompleto</option>
                <option value="Superior Completo">Superior Completo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Curso</label>
              <input name="curso" type="text" required placeholder="Ex: Engenharia de Software" className="w-full p-3 border rounded-xl" />
            </div>
          </>
        )}

        {tipo !== "CANDIDATO" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">CNPJ</label>
              <input name="cnpj" type="text" required maxLength={18} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
              <input name="telefone" type="text" required className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade Sede</label>
              <input name="cidade" type="text" required className="w-full p-3 border rounded-xl" />
            </div>
          </>
        )}

        <button disabled={loading} className="w-full mt-4 bg-electric-yellow text-deep-black font-bold py-3.5 rounded-pill transition hover:-translate-y-0.5">
          {loading ? "Processando..." : "Criar Conta"}
        </button>
      </form>
    </div>
  );
}