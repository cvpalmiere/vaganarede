import Link from "next/link";
import { ArrowUpRight, ArrowDown, UserCircle, Building2, Network, ShieldCheck, FileLock2, Lock } from "lucide-react";
import { HeroPreview } from "@/components/landing/hero-preview";
import { FeatureAccordion } from "@/components/landing/feature-accordion";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

function whatsappLink(mensagem: string) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensagem);
}

export default function LandingPage() {
  return (
    <div className="w-full overflow-hidden">
      <header className="fixed top-0 z-50 w-full nav-glass">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/"><img src="/logo-branco.png" alt="Vagas na Rede" style={{ height: 20, width: "auto" }} /></Link>
          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#recursos" className="text-zinc-300 transition hover:text-yellow-300">Recursos</Link>
            <Link href="#empresas" className="text-zinc-300 transition hover:text-yellow-300">Para empresas</Link>
            <Link href="#candidatos" className="text-zinc-300 transition hover:text-yellow-300">Para candidatos</Link>
            <Link href="#agencias" className="text-zinc-300 transition hover:text-yellow-300">Agências de RH</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-pill border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:border-yellow-300 hover:text-yellow-200 sm:px-4">
              Entrar
            </Link>
            <Link href="/cadastro" className="rounded-pill bg-electric-yellow px-3 py-2 text-sm font-bold text-deep-black transition hover:-translate-y-0.5 sm:px-4">
              Começar agora
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section id="inicio" className="grid-noise relative bg-deep-black pt-32 text-white lg:pt-40">
          <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:pb-28">
            <div>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.03] tracking-[-.055em] sm:text-5xl lg:text-6xl">
                Recrutamento inteligente. Conexões que geram oportunidades.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                A Vagas na Rede conecta candidatos, empresas e agências de RH em uma única plataforma segura, com score de compatibilidade real em cada etapa do recrutamento.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cadastro"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-electric-yellow px-6 py-3.5 font-bold text-deep-black transition hover:-translate-y-0.5"
                >
                  Começar agora
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#recursos"
                  className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:border-yellow-300 hover:text-yellow-200"
                >
                  Conhecer a plataforma
                  <ArrowDown className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-5 text-sm text-zinc-500">Uma rede feita para aproximar pessoas, processos e decisões.</p>
            </div>

            <HeroPreview />
          </div>
        </section>

        <section className="bg-electric-yellow">
          <div className="mx-auto grid max-w-7xl divide-y divide-black/15 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
            <div className="py-7 sm:px-7">
              <p className="text-xl font-bold tracking-tight text-deep-black">Candidatos</p>
              <p className="mt-1 text-sm text-deep-black/65">Talentos em busca da próxima oportunidade.</p>
            </div>
            <div className="py-7 sm:px-7">
              <p className="text-xl font-bold tracking-tight text-deep-black">Empresas</p>
              <p className="mt-1 text-sm text-deep-black/65">Times que querem contratar com mais visão.</p>
            </div>
            <div className="py-7 sm:px-7">
              <p className="text-xl font-bold tracking-tight text-deep-black">Agências de RH</p>
              <p className="mt-1 text-sm text-deep-black/65">Operações que conectam diferentes clientes.</p>
            </div>
          </div>
        </section>

        <section id="empresas" className="bg-off-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-yellow-700">Feita para a sua jornada</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-.045em] text-deep-black sm:text-4xl">
                Uma plataforma. Três experiências.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-zinc-600">
                Cada perfil encontra uma experiência pensada para transformar a rotina de recrutamento em movimento.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <article id="candidatos" className="soft-card rounded-[1.7rem] bg-white p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-deep-black p-3 text-electric-yellow">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">01</span>
                </div>
                <h3 className="mt-10 text-2xl font-bold tracking-[-.035em] text-deep-black">Para candidatos</h3>
                <p className="mt-3 leading-7 text-zinc-600">
                  Cadastro gratuito para apresentar currículo, skills e se candidatar a vagas que fazem sentido para sua trajetória.
                </p>
                <div className="mt-7 border-t border-black/10 pt-5">
                  <p className="text-sm font-semibold text-deep-black">Seu perfil, sua próxima conexão.</p>
                </div>
              </article>

              <article className="soft-card rounded-[1.7rem] bg-[#1b1b1b] p-6 text-white sm:p-7">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-electric-yellow p-3 text-deep-black">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[.14em] text-zinc-500">02</span>
                </div>
                <h3 className="mt-10 text-2xl font-bold tracking-[-.035em]">Para empresas</h3>
                <p className="mt-3 leading-7 text-zinc-300">
                  Publique vagas, avalie candidatos e acompanhe o processo seletivo com uma visão mais organizada da operação.
                </p>
                <div className="mt-7 border-t border-white/15 pt-5">
                  <p className="text-sm font-semibold text-yellow-200">Decisões melhores começam com clareza.</p>
                </div>
              </article>

              <article id="agencias" className="soft-card rounded-[1.7rem] bg-white p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-deep-black p-3 text-electric-yellow">
                    <Network className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[.14em] text-zinc-400">03</span>
                </div>
                <h3 className="mt-10 text-2xl font-bold tracking-[-.035em] text-deep-black">Para agências de RH</h3>
                <p className="mt-3 leading-7 text-zinc-600">
                  Um painel master para gerenciar vagas de vários clientes com organização e contexto para cada frente de trabalho.
                </p>
                <div className="mt-7 border-t border-black/10 pt-5">
                  <p className="text-sm font-semibold text-deep-black">Mais controle para uma operação em rede.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="recursos" className="bg-deep-black py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-yellow-500">
                  Tudo o que você precisa para contratar melhor
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-.045em] sm:text-4xl">Funcionalidades</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-zinc-400">
                Os caminhos e funcionalidades do sistema, organizados por quem usa cada um.
              </p>
            </div>

            <div className="mt-8">
              <FeatureAccordion />
            </div>
          </div>
        </section>

        <section className="grid-noise bg-[#151515] py-20 text-white lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
            <div>
              <div className="inline-flex rounded-2xl border border-yellow-300/35 bg-yellow-300/10 p-4 text-yellow-200">
                <ShieldCheck className="h-9 w-9" />
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-yellow-200">Segurança por princípio</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-.045em] sm:text-4xl">
                Seus dados protegidos em cada etapa
              </h2>
            </div>
            <div className="rounded-[1.7rem] border border-white/15 bg-white/5.5 p-7 backdrop-blur-sm sm:p-9">
              <p className="text-lg leading-8 text-zinc-200">
                Documentos sensíveis, como CPF e CNPJ, são criptografados com AES-256-GCM. A arquitetura da Vagas na Rede
                foi pensada para proteger dados de candidatos e empresas enquanto as conexões acontecem.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <FileLock2 className="h-5 w-5 text-electric-yellow" />
                  <p className="mt-4 text-sm font-semibold text-white">Documentos sensíveis tratados com cuidado.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <Lock className="h-5 w-5 text-electric-yellow" />
                  <p className="mt-4 text-sm font-semibold text-white">Acesso restrito por perfil de usuário.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="planos" className="bg-off-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-yellow-700">Planos para empresas</p>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-[-.045em] text-deep-black sm:text-4xl">
                Escolha a estrutura que acompanha a sua operação
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              <article className="soft-card rounded-[1.7rem] bg-white p-7">
                <p className="text-sm font-bold uppercase tracking-[.14em] text-zinc-500">Empresa</p>
                <h3 className="mt-5 text-2xl font-bold tracking-[-.035em] text-deep-black">Standard</h3>
                <p className="mt-4 text-3xl font-bold text-deep-black">
                  R$ 299<span className="text-sm font-normal text-gray-500">/mês</span>
                </p>
                <p className="mt-4 min-h-14 leading-7 text-zinc-600">Até 10 vagas/mês e acesso ao banco de currículos.</p>
                <Link
                  href="/cadastro?tipo=EMPRESA"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-pill border border-black px-5 py-3 font-bold text-deep-black transition hover:bg-black hover:text-white"
                >
                  Começar agora
                </Link>
              </article>

              <article className="rounded-[1.7rem] bg-deep-black p-7 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold uppercase tracking-[.14em] text-yellow-200">Empresa de RH</p>
                  <span className="rounded-pill bg-electric-yellow px-3 py-1 text-xs font-bold text-deep-black">EM DESTAQUE</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold tracking-[-.035em]">Pro</h3>
                <p className="mt-4 text-3xl font-bold">
                  R$ 899<span className="text-sm font-normal text-gray-400">/mês</span>
                </p>
                <p className="mt-4 min-h-14 leading-7 text-zinc-300">Vagas ilimitadas, múltiplos clientes e API de integração.</p>
                <Link
                  href="/cadastro?tipo=EMPRESA_RH"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-pill bg-electric-yellow px-5 py-3 font-bold text-deep-black transition hover:-translate-y-0.5"
                >
                  Começar agora
                </Link>
              </article>

              <article className="soft-card rounded-[1.7rem] bg-[#e9e8e1] p-7">
                <p className="text-sm font-bold uppercase tracking-[.14em] text-zinc-500">Sua realidade primeiro</p>
                <h3 className="mt-5 text-2xl font-bold tracking-[-.035em] text-deep-black">Sob medida</h3>
                <p className="mt-4 min-h-14 leading-7 text-zinc-600">
                  Uma conversa para encontrar o formato ideal para a sua operação.
                </p>
                <Link
                  href={whatsappLink("Quero falar sobre um plano sob medida")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-pill border border-black px-5 py-3 font-bold text-deep-black transition hover:bg-black hover:text-white"
                >
                  Falar com a gente
                </Link>
              </article>
            </div>

            <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-center sm:flex-row sm:text-left">
              <p className="text-sm text-zinc-600">Pagamento processado com segurança via Stripe.</p>
              <p className="rounded-pill bg-yellow-100 px-4 py-2 text-sm font-bold text-deep-black">
                Pagou, ativou — sem espera manual.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-electric-yellow py-20 lg:py-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center px-5 text-center">
            <h2 className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tighter text-deep-black sm:text-5xl">
              O próximo talento pode estar mais perto do que você imagina.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-deep-black/70">
              Crie conexões mais diretas entre quem procura e quem constrói oportunidades.
            </p>
            <Link
              href="/cadastro"
              className="mt-8 inline-flex items-center gap-2 rounded-pill bg-deep-black px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5"
            >
              Começar agora
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-deep-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="flex flex-col justify-between gap-10 border-b border-white/15 pb-10 md:flex-row">
            <div>
              <img src="/logo-branco.png" alt="Vagas na Rede" style={{ height: 24, width: "auto" }} />
              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                Uma plataforma para gerir talentos, oportunidades e processos com mais confiança.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-3">
              <Link href="#recursos" className="text-zinc-300 hover:text-yellow-200">Recursos</Link>
              <Link href="#empresas" className="text-zinc-300 hover:text-yellow-200">Para empresas</Link>
              <Link href="#candidatos" className="text-zinc-300 hover:text-yellow-200">Para candidatos</Link>
              <Link href="#agencias" className="text-zinc-300 hover:text-yellow-200">Agências de RH</Link>
              <Link href="/login" className="text-zinc-300 hover:text-yellow-200">Entrar</Link>
              <Link href="/cadastro" className="text-yellow-200 hover:text-white">Começar agora</Link>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-xs leading-5 text-zinc-500">
              Vagas na Rede — tecnologia para uma gestão de talentos mais conectada e responsável.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

