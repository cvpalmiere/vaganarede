import { Clock } from "lucide-react";

export default function PendenteAprovacaoRh() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="glass rounded-card p-10 border border-white max-w-md text-center">
        <Clock className="w-8 h-8 text-electric-yellow mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-deep-black mb-3">Cadastro em análise</h1>
        <p className="text-gray-600">
          Seu cadastro de Empresa de RH está sendo revisado pela nossa equipe. Assim que for aprovado,
          você já pode criar empresas-cliente e publicar vagas normalmente.
        </p>
      </div>
    </div>
  );
}
