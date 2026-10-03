export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-off-white px-6 py-16">
      <div className="max-w-2xl mx-auto prose">
        <h1 className="text-3xl font-bold text-deep-black mb-2">Termos de Uso</h1>
        <p className="text-sm text-gray-500 mb-8">Ultima atualizacao: outubro de 2026</p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">1. Sobre a plataforma</h2>
        <p className="text-gray-700 leading-relaxed">
          O Vagas na Rede conecta candidatos a oportunidades de emprego publicadas por empresas e agencias de RH.
          O cadastro de candidato e gratuito. Empresas e agencias de RH passam por analise de cadastro antes de
          publicar vagas.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">2. Cadastro e veracidade das informacoes</h2>
        <p className="text-gray-700 leading-relaxed">
          Voce e responsavel pela veracidade dos dados informados no cadastro, incluindo CPF ou CNPJ. Dados falsos
          ou documentos invalidos podem levar a suspensao da conta.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">3. Uso da plataforma</h2>
        <p className="text-gray-700 leading-relaxed">
          E proibido usar a plataforma para fins diferentes de recrutamento e busca de emprego, incluindo spam,
          coleta indevida de dados de terceiros ou publicacao de vagas falsas.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">4. Candidaturas e compatibilidade</h2>
        <p className="text-gray-700 leading-relaxed">
          O score de compatibilidade exibido para cada vaga e calculado automaticamente a partir do perfil do
          candidato e dos requisitos da vaga. Ele e uma referencia e nao garante contratacao.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">5. Planos e cobranca</h2>
        <p className="text-gray-700 leading-relaxed">
          Empresas e agencias de RH podem estar sujeitas a aprovacao de cadastro e, quando aplicavel, a planos
          pagos processados atraves do Stripe. Valores e condicoes vigentes sao exibidos na tela de assinatura.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">6. Encerramento de conta</h2>
        <p className="text-gray-700 leading-relaxed">
          Voce pode encerrar sua conta a qualquer momento nas configuracoes do seu perfil. Veja a nossa{" "}
          <a href="/privacidade" className="text-deep-black font-semibold underline">Politica de Privacidade</a>{" "}
          para entender o que acontece com seus dados apos o encerramento.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">7. Contato</h2>
        <p className="text-gray-700 leading-relaxed">
          Duvidas sobre estes termos podem ser enviadas pelo WhatsApp disponivel na pagina inicial.
        </p>
      </div>
    </div>
  );
}
