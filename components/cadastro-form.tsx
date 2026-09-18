"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserCircle, Building2, Network, ArrowLeft } from "lucide-react";
import { ROTA_POR_TIPO } from "@/lib/rotas";

type Tipo = "CANDIDATO" | "EMPRESA" | "EMPRESA_RH";

const OPCOES: { tipo: Tipo; titulo: string; texto: string; icone: typeof UserCircle }[] = [
  { tipo: "CANDIDATO", titulo: "Sou Candidato", texto: "Cadastro gratuito. Currículo, skills e vagas compatíveis.", icone: UserCircle },
  { tipo: "EMPRESA", titulo: "Sou Empresa", texto: "Publique vagas e acesse o banco de currículos.", icone: Building2 },
  { tipo: "EMPRESA_RH", titulo: "Sou Empresa de RH", texto: "Gerencie vagas de múltiplas empresas-cliente.", icone: Network },
];

export function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoInicial = searchParams.get("tipo") as Tipo | null;

  const [tipo, setTipo] = useState<Tipo | null>(tipoInicial);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", cpf: "", cnpj: "", telefone: "", cidade: "" });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  function atualizar(campo: string, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!tipo) return;
    setErro("");
    setEnviando(true);

    const corpo: Record<string, string> =
      tipo === "CANDIDATO"
        ? { tipo, nome: form.nome, email: form.email, senha: form.senha, cpf: form.cpf }
        : { tipo, nome: form.nome, email: form.email, senha: form.senha, cnpj: form.cnpj, telefone: form.telefone, cidade: form.cidade };

    const respostaSignup = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const dadosSignup = await respostaSignup.json();

    if (!respostaSignup.ok) {
      setErro(dadosSignup.erro ?? "Falha ao cadastrar");
      setEnviando(false);
      return;
    }

    // login automatico logo apos o cadastro, pra nao pedir a mesma senha duas vezes
    const respostaLogin = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, senha: form.senha }),
    });
    const dadosLogin = await respostaLogin.json();

    setEnviando(false);

    if (!respostaLogin.ok) {
      router.push("/login");
      return;
    }

    router.push(ROTA_POR_TIPO[dadosLogin.tipo] ?? "/");
    router.refresh();
  }

  if (!tipo) {
    return (
      <div className="min-h-screen bg-deep-black text-white flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-center mb-2">Como você quer se cadastrar?</h1>
          <p className="text-gray-400 text-center mb-10">Escolha o tipo de conta para continuar.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {OPCOES.map((op) => {
              const Icone = op.icone;
              return (
                <button
                  key={op.tipo}
                  onClick={() => setTipo(op.tipo)}
                  className="glass-dark border border-gray-800 rounded-card p-6 text-left hover:border-electric-yellow transition"
                >
                  <Icone className="w-6 h-6 text-electric-yellow mb-4" />
                  <h3 className="font-bold mb-1">{op.titulo}</h3>
                  <p className="text-xs text-gray-400">{op.texto}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white flex items-center justify-center px-6 py-16">
      <div className="glass-dark p-8 md:p-10 rounded-card border border-gray-800 w-full max-w-md">
        <button onClick={() => setTipo(null)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          Trocar tipo de conta
        </button>

        <h1 className="text-2xl font-bold mb-6">
          {tipo === "CANDIDATO" ? "Cadastro de Candidato" : tipo === "EMPRESA" ? "Cadastro de Empresa" : "Cadastro de Empresa de RH"}
        </h1>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {tipo === "CANDIDATO" ? "Nome completo" : "Razão social"}
            </label>
            <input required value={form.nome} onChange={(e) => atualizar("nome", e.target.value)}
              className="w-full mt-1 bg-deep-black border border-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">E-mail</label>
            <input required type="email" value={form.email} onChange={(e) => atualizar("email", e.target.value)}
              className="w-full mt-1 bg-deep-black border border-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Senha (mínimo 8 caracteres)</label>
            <input required type="password" minLength={8} value={form.senha} onChange={(e) => atualizar("senha", e.target.value)}
              className="w-full mt-1 bg-deep-black border border-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
          </div>

          {tipo === "CANDIDATO" ? (
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">CPF</label>
              <input required value={form.cpf} onChange={(e) => atualizar("cpf", e.target.value)} placeholder="Somente números"
                className="w-full mt-1 bg-deep-black border border-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">CNPJ</label>
                <input required value={form.cnpj} onChange={(e) => atualizar("cnpj", e.target.value)} placeholder="Somente números"
                  className="w-full mt-1 bg-deep-black border border-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Telefone</label>
                <input required value={form.telefone} onChange={(e) => atualizar("telefone", e.target.value)}
                  className="w-full mt-1 bg-deep-black border border-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cidade</label>
                <input required value={form.cidade} onChange={(e) => atualizar("cidade", e.target.value)}
                  className="w-full mt-1 bg-deep-black border border-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:border-electric-yellow" />
              </div>
            </>
          )}

          {erro && <p className="text-sm text-red-400">{erro}</p>}

          <button type="submit" disabled={enviando}
            className="w-full bg-electric-yellow text-deep-black font-bold py-4 rounded-lg hover:bg-electric-yellow-dark transition disabled:opacity-50">
            {enviando ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
}