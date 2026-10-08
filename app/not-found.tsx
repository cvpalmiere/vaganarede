import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-deep-black text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <Logo variante="branco" altura={22} />
      </div>
      <p className="text-electric-yellow font-bold text-sm mb-2">ERRO 404</p>
      <h1 className="text-3xl font-bold mb-3">Essa pagina nao existe</h1>
      <p className="text-zinc-400 mb-8 max-w-md">
        O link pode estar errado ou a pagina foi movida. Volta pra home e tenta de novo.
      </p>
      <Link href="/" className="bg-electric-yellow text-deep-black font-bold px-6 py-3 rounded-pill hover:-translate-y-0.5 transition">
        Voltar para a home
      </Link>
    </div>
  );
}
