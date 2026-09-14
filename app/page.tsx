import Link from "next/link";
import { ShieldCheck, CreditCard, Briefcase, Users } from "lucide-react";
import { BayerGlobe } from "@/components/bayer-globe";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

function whatsappLink(mensagem: string) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensagem);
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white font-sans">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-electric-yellow rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-deep-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">Vagas na Rede</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="#funcionalidades" className="hover:text-electric-yellow transition">Funcionalidades</Link>
          <Link href="#seguranca" className="hover:text-electric-yellow transition">Seguranca</Link>
          <Link href="#planos" className="hover:text-electric-yellow transition">Planos</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-electric-yellow transition">Entrar</Link>
          <Link
            href={whatsappLink("Quero comecar agora no Vagas na Rede")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-electric-yellow text-deep-black px-5 py-2.5 rounded-pill text-sm font-bold hover:bg-electric-yellow-dark transition"
          >
            Comecar Agora
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-electric-yellow bg-electric-yellow/10 px-3 py-1.5 rounded-pill mb-8">
          <span className="w-1.5 h-1.5 bg-electric-yellow rounded-full" />
          SaaS Full-Stack de Recrutamento
        </span>
        <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
          Conecte talentos com <span className="text-electric-yellow">precisao absoluta.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-10">
          Plataforma automatizada e segura para empresas, agencias de RH e candidatos. Score de
          compatibilidade real, RBAC completo e verificacao de documentos em cada cadastro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={whatsappLink("Quero ver uma demonstracao do Vagas na Rede")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-electric-yellow text-deep-black px-8 py-4 rounded-pill font-bold hover:bg-electric-yellow-dark transition"
          >
            Ver Demonstracao
          </Link>
          <Link
            href="#funcionalidades"
            className="border border-gray-700 text-white px-8 py-4 rounded-pill font-bold hover:border-electric-yellow transition"
          >
            Explorar Funcionalidades
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 mt-10 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-burnt-orange" />
            AES-256-GCM Crypto
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-electric-yellow" />
            Stripe Partner
          </span>
        </div>
      </section>

      <section id="funcionalidades" className="py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Arquitetura de Alta Performance</h2>
          <p className="text-gray-400 mb-16">
            Construido pra escalar, com seguranca e velocidade desde a primeira linha de codigo.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-900/40 p-8 rounded-card border border-gray-800">
              <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">RBAC Avancado</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Gestao por papeis (Candidato, Empresa, Empresa de RH). Controle estrito de
                permissoes e roteamento dinamico via Supabase Auth.
              </p>
            </div>
            <div className="bg-gray-900/40 p-8 rounded-card border border-gray-800">
              <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Seguranca Sensivel</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Criptografia reversivel AES-256-GCM para documentos (CPF/CNPJ). Buscas seguras
                via hash deterministico e validacao matematica.
              </p>
            </div>
            <div className="bg-gray-900/40 p-8 rounded-card border border-gray-800">
              <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Paywall Automatizado</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Integracao Stripe completa. Webhooks seguros para gestao de assinaturas,
                inadimplencia e bloqueio de rotas corporativas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="seguranca" className="py-24 border-t border-gray-800/50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Vagas por todo o mundo</h2>
        <p className="text-gray-400 mb-16">Conectamos talentos e empresas com uma rede em expansao constante.</p>
        <div className="max-w-md mx-auto h-[380px]">
          <BayerGlobe colorA="#000000" colorB="#FFE500" pixel={12} land={0.55} globeSize={0.22} speed={0.4} />
        </div>
      </section>

      <section id="planos" className="py-24 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Planos Corporativos</h2>
          <p className="text-gray-400 mb-16">Desbloqueie o acesso completo pra sua empresa ou agencia de RH.</p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-900/40 p-8 rounded-card border border-gray-800">
              <h3 className="text-lg font-bold mb-1">Empresa Standard</h3>
              <p className="text-3xl font-bold mb-6">R$ 299<span className="text-sm text-gray-500 font-normal">/mes</span></p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li>Publicacao de ate 10 vagas/mes</li>
                <li>Acesso a perfis de candidatos</li>
                <li>Dashboard de gestao simples</li>
              </ul>
              <Link
                href={whatsappLink("Quero assinar o plano Empresa Standard")}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center border border-gray-700 py-3 rounded-pill font-bold hover:border-electric-yellow transition"
              >
                Assinar Standard
              </Link>
            </div>
            <div className="bg-gray-900/40 p-8 rounded-card border border-electric-yellow/50">
              <h3 className="text-lg font-bold text-electric-yellow mb-1">Agencia RH Pro</h3>
              <p className="text-3xl font-bold mb-6">R$ 899<span className="text-sm text-gray-500 font-normal">/mes</span></p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li>Vagas ilimitadas</li>
                <li>Busca avancada de candidatos</li>
                <li>Multiplos recrutadores e API</li>
              </ul>
              <Link
                href={whatsappLink("Quero assinar o plano Agencia RH Pro")}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-electric-yellow text-deep-black py-3 rounded-pill font-bold hover:bg-electric-yellow-dark transition"
              >
                Assinar Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-gray-800/50">
        <div className="max-w-2xl mx-auto px-6 text-center border border-gray-800 rounded-card p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Pronto para revolucionar seu recrutamento?</h2>
          <p className="text-gray-400 mb-8">
            Candidatos acessam gratuitamente. Empresas gerenciam tudo em um so lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={whatsappLink("Sou empresa ou agencia de RH e quero me cadastrar")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-deep-black px-8 py-3.5 rounded-pill font-bold hover:bg-gray-200 transition"
            >
              Sou Empresa / RH
            </Link>
            <Link
              href={whatsappLink("Sou candidato e quero me cadastrar gratuitamente")}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-700 px-8 py-3.5 rounded-pill font-bold hover:border-electric-yellow transition"
            >
              Sou Candidato (Gratis)
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-gray-800/50 max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <span>2026 Vagas na Rede. Todos os direitos reservados.</span>
        <div className="flex gap-6">
          <Link href="/termos" className="hover:text-gray-300 transition">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-gray-300 transition">Privacidade</Link>
          <Link href="/contato" className="hover:text-gray-300 transition">Contato</Link>
        </div>
      </footer>
    </div>
  );
}
