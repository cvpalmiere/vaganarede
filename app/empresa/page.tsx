import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Briefcase, 
  Users, 
  Plus, 
  BarChart3, 
  Clock, 
  ChevronRight, 
  Search,
  Building2
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function EmpresaDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Busca a empresa e as suas vagas com candidaturas
  const empresa = await prisma.empresa.findUnique({
    where: { usuarioId: user.id },
    include: {
      vagas: {
        orderBy: { criadoEm: 'desc' },
        include: {
          candidaturas: true,
        }
      }
    }
  });

  if (!empresa) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Perfil de empresa não encontrado.</p>
      </div>
    );
  }

  // Cálculos de Métricas
  const totalVagas = empresa.vagas.length;
  const vagasAtivas = empresa.vagas.filter(v => v.status === "ATIVA").length;
  const totalCandidaturas = empresa.vagas.reduce((acc, vaga) => acc + vaga.candidaturas.length, 0);
  const candidaturasEmAnalise = empresa.vagas.reduce((acc, vaga) => 
    acc + vaga.candidaturas.filter(c => c.status === "EM_ANALISE").length, 0
  );

  const vagasRecentes = empresa.vagas.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Cabeçalho de Boas-vindas */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-deep-black mb-1">Olá, {empresa.razaoSocial} 👋</h1>
          <p className="text-gray-500">Aqui está o resumo do seu recrutamento hoje.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/empresa/candidatos" 
            className="glass px-4 py-2 rounded-lg font-medium text-deep-black flex items-center gap-2 border border-white hover:bg-white/50 transition-colors"
          >
            <Search className="w-4 h-4" />
            Buscar Talentos
          </Link>
          <Link 
            href="/empresa/vagas/nova" 
            className="bg-electric-yellow text-deep-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Vaga
          </Link>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-deep-black rounded-card p-6 text-white shadow-sm">
          <Briefcase className="w-6 h-6 text-electric-yellow mb-4" />
          <p className="text-3xl font-bold">{vagasAtivas}</p>
          <p className="text-sm text-gray-400 mt-1">Vagas Ativas</p>
        </div>
        
        <div className="glass rounded-card p-6 border border-white shadow-sm">
          <BarChart3 className="w-6 h-6 text-gray-600 mb-4" />
          <p className="text-3xl font-bold text-deep-black">{totalVagas}</p>
          <p className="text-sm text-gray-500 mt-1">Total Publicado (Histórico)</p>
        </div>

        <div className="glass rounded-card p-6 border border-white shadow-sm">
          <Users className="w-6 h-6 text-gray-600 mb-4" />
          <p className="text-3xl font-bold text-deep-black">{totalCandidaturas}</p>
          <p className="text-sm text-gray-500 mt-1">Candidaturas Recebidas</p>
        </div>

        <div className="glass rounded-card p-6 border border-white shadow-sm">
          <Clock className="w-6 h-6 text-gray-600 mb-4" />
          <p className="text-3xl font-bold text-deep-black">{candidaturasEmAnalise}</p>
          <p className="text-sm text-gray-500 mt-1">Currículos em Análise</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Vagas Recentes */}
        <div className="lg:col-span-2 glass rounded-card p-6 border border-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-deep-black flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Vagas Recentes
            </h2>
            <Link href="/empresa/vagas" className="text-sm text-blue-600 hover:underline font-medium">
              Ver todas
            </Link>
          </div>

          {vagasRecentes.length === 0 ? (
            <div className="bg-gray-50/50 rounded-lg p-8 text-center border border-gray-100 border-dashed">
              <p className="text-gray-500 text-sm mb-4">Ainda não publicou nenhuma vaga.</p>
              <Link 
                href="/empresa/vagas/nova" 
                className="inline-flex bg-deep-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
              >
                Publicar Primeira Vaga
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {vagasRecentes.map((vaga) => (
                <div key={vaga.id} className="bg-white/60 hover:bg-white border border-white p-4 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div>
                    <h3 className="font-bold text-deep-black">{vaga.titulo}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium">
                      <span className={`px-2 py-0.5 rounded-full ${
                        vaga.status === "ATIVA" ? "bg-green-100 text-green-700" : 
                        vaga.status === "PAUSADA" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-red-100 text-red-700"
                      }`}>
                        {vaga.status}
                      </span>
                      <span>•</span>
                      <span>{vaga.modelo}</span>
                      <span>•</span>
                      <span>{vaga.nivel}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-center">
                      <p className="text-xl font-bold text-deep-black">{vaga.candidaturas.length}</p>
                      <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Candidatos</p>
                    </div>
                    <Link 
                      href={`/empresa/vagas/${vaga.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 group-hover:bg-electric-yellow group-hover:text-deep-black transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Painel Direito: Dicas e Atalhos */}
        <div className="space-y-6">
          <div className="glass rounded-card p-6 border border-white shadow-sm bg-gradient-to-br from-white/40 to-electric-yellow/10">
            <h3 className="font-bold text-deep-black mb-2">Maximize as suas chances</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vagas com descrição detalhada e faixa salarial visível recebem até <strong>4x mais candidaturas qualificadas</strong>.
            </p>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-electric-yellow rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">Completude do Perfil: 75%</p>
          </div>

          <div className="glass rounded-card p-6 border border-white shadow-sm">
            <h3 className="font-bold text-deep-black mb-4">Acesso Rápido</h3>
            <div className="space-y-2">
              <Link href="/empresa/perfil" className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 flex items-center justify-between">
                Editar Perfil da Empresa
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/empresa/assinatura" className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 flex items-center justify-between">
                Gerir Assinatura e Planos
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}