"import client";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Briefcase } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
function whatsappLink(mensagem: string) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensagem);
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      // 1. Autentica no Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      // 2. Descobre o tipo de usuário no app_metadata ou tabela de usuários para redirecionar certo
      const user = data.user;
      const tipoUsuario = user?.app_metadata?.tipo_usuario;

      if (tipoUsuario === "EMPRESA" || tipoUsuario === "EMPRESA_RH") {
        router.push("/empresa/dashboard");
      } else {
        router.push("/candidato");
      }
      
      router.refresh();
    } catch (err: any) {
      setErro(err.message || "Erro ao fazer login. Verifique suas credenciais.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-deep-black text-white flex flex-col justify-between py-8 px-5">
      <header className="max-w-md mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-7 h-7 bg-electric-yellow rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-deep-black" />
          </div>
          <span className="font-bold text-sm text-white">Vagas na Rede</span>
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto my-auto p-6 bg-[#18181b] border border-white/10 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-white">Entrar</h1>
        <p className="text-sm text-zinc-400 mb-6">Acesse sua conta no Vagas na Rede.</p>

        {erro && (
          <p className="mb-4 text-sm text-red-400 bg-red-950/50 p-3 rounded-lg border border-red-800">
            {erro}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">E-mail</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">Senha</label>
            <input 
              type="password" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-white focus:border-yellow-400 focus:outline-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-4 bg-electric-yellow text-deep-black font-bold py-3.5 rounded-pill transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="text-yellow-300 font-semibold hover:underline">
            Cadastre-se
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-zinc-500">
          Problemas de acesso?{" "}
          <a 
            href={whatsappLink("Estou com dificuldades para acessar minha conta no Vagas na Rede")} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-300 hover:underline"
          >
            Fale com a gente
          </a>
        </div>
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-xs text-zinc-500">
        Vagas na Rede — Todos os direitos reservados.
      </footer>
    </div>
  );
}