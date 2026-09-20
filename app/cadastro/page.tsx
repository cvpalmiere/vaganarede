import { Suspense } from "react";
import { CadastroForm } from "@/components/cadastro-form";
import { Logo } from "@/components/logo";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white flex flex-col justify-between py-8 px-5">
      <header className="max-w-md mx-auto w-full">
        <Logo variante="branco" altura={20} />
      </header>

      <main className="w-full my-auto">
        <Suspense fallback={null}>
          <CadastroForm />
        </Suspense>
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-xs text-zinc-500">
        Vagas na Rede — Todos os direitos reservados.
      </footer>
    </div>
  );
}