export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-off-white px-6 py-16">
      <div className="max-w-2xl mx-auto prose">
        <h1 className="text-3xl font-bold text-deep-black mb-2">Politica de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">Em conformidade com a Lei Geral de Protecao de Dados (LGPD). Ultima atualizacao: outubro de 2026</p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">1. Quais dados coletamos</h2>
        <ul className="list-disc pl-5 text-gray-700 leading-relaxed space-y-1">
          <li>Dados de cadastro: nome, e-mail, telefone, CPF ou CNPJ</li>
          <li>Dados de perfil: cidade, escolaridade, curso, habilidades, preferencias de vaga</li>
          <li>Documentos enviados para verificacao (RG, CNH, comprovantes)</li>
          <li>Historico de candidaturas e interacoes com vagas</li>
          <li>Dados tecnicos de uso (paginas acessadas, data do acesso)</li>
        </ul>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">2. Como protegemos seus dados</h2>
        <p className="text-gray-700 leading-relaxed">
          CPF e CNPJ sao armazenados de forma criptografada (AES-256-GCM). Acesso aos dados e restrito por tipo de
          usuario: uma empresa so visualiza dados de candidatos que se candidataram as suas vagas ou que aparecem
          no banco de curriculos, nunca dados de outras empresas.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">3. Com quem compartilhamos</h2>
        <p className="text-gray-700 leading-relaxed">
          Dados de candidatos sao compartilhados com empresas apenas quando ha candidatura a uma vaga, ou quando o
          perfil aparece em uma busca do banco de curriculos. Usamos processadores de pagamento (Stripe), hospedagem
          (Vercel), banco de dados (Supabase) e envio de notificacoes (Resend para e-mail, Meta/WhatsApp Business
          para mensagens) como operadores de dados, seguindo suas proprias politicas de seguranca.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">4. Seus direitos (LGPD)</h2>
        <p className="text-gray-700 leading-relaxed mb-2">Voce pode, a qualquer momento:</p>
        <ul className="list-disc pl-5 text-gray-700 leading-relaxed space-y-1">
          <li>Confirmar quais dados temos sobre voce</li>
          <li>Baixar uma copia dos seus dados (exportacao disponivel no seu perfil)</li>
          <li>Corrigir dados incompletos ou desatualizados, editando seu perfil</li>
          <li>Solicitar a exclusao da sua conta e dos dados associados</li>
          <li>Revogar o consentimento dado no cadastro</li>
        </ul>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">5. Exportacao e exclusao de dados</h2>
        <p className="text-gray-700 leading-relaxed">
          Candidatos encontram as opcoes de exportar e excluir seus dados em{" "}
          <a href="/candidato/conta" className="text-deep-black font-semibold underline">Minha Conta</a>.
          A exclusao remove permanentemente o perfil, documentos, candidaturas e historico associados, e nao pode
          ser desfeita.
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">6. Retencao de dados</h2>
        <p className="text-gray-700 leading-relaxed">
          Mantemos os dados enquanto a conta estiver ativa. Apos exclusao solicitada pelo usuario, os dados sao
          removidos do banco em ate 30 dias, exceto quando a retencao for exigida por obrigacao legal (ex: dados
          fiscais de transacoes ja processadas).
        </p>

        <h2 className="text-xl font-bold text-deep-black mt-8 mb-3">7. Contato do encarregado de dados</h2>
        <p className="text-gray-700 leading-relaxed">
          Para exercer seus direitos ou tirar duvidas sobre tratamento de dados, entre em contato pelo WhatsApp
          disponivel na pagina inicial.
        </p>
      </div>
    </div>
  );
}
