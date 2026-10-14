import { Clock } from "lucide-react";

export default function PendenteAprovacaoEmpresa() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="glass rounded-card p-10 border border-white max-w-md text-center">
        <Clock className="w-8 h-8 text-electric-yellow mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-deep-black mb-3">Cadastro em análise</h1>
        <p className="text-gray-600">
          Seu cadastro foi recebido e está sendo revisado pela nossa equipe. Assim que for aprovado,
          você recebe um e-mail e já pode publicar vagas normalmente.
        </p>
      </div>
    </div>
  );
}
