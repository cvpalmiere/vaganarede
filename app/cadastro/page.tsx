import { Suspense } from "react";
import Link from "next/link";
import { CadastroForm } from "@/components/cadastro-form";
import { Briefcase } from "lucide-react";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white flex flex-col justify-between py-8 px-5">
      {/* Cabeçalho simples com logo para voltar à home */}
      <header className="max-w-md mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-7 h-7 bg-electric-yellow rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-deep-black" />
          </div>
          <span className="font-bold text-sm text-white">Vagas na Rede</span>
        </Link>
      </header>

      {/* Formulário centralizado */}
      <main className="w-full my-auto">
        <Suspense fallback={null}>
          <CadastroForm />
        </Suspense>
      </main>

      {/* Rodapé minimalista */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-zinc-500">
        Vagas na Rede — Todos os direitos reservados.
      </footer>
    </div>
  );
}