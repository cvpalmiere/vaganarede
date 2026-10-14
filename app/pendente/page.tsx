import { Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ContaPendentePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md text-center">
        <Clock className="w-16 h-16 text-electric-yellow mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-deep-black mb-2">
          Aprovação Pendente
        </h1>
        
        <p className="text-gray-600 mb-6">
          A sua conta de empresa foi registada e está a aguardar aprovação. 
          <strong className="text-deep-black block mt-2">Em até 1 dia útil ela será analisada e liberada pela nossa equipa.</strong>
        </p>
        
        <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm p-4 rounded-lg flex items-start text-left mb-6">
          <ShieldCheck className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-yellow-600" />
          <span>Isto é uma medida de segurança para garantir a qualidade das vagas na rede. Receberá uma notificação assim que for aprovado.</span>
        </div>

        <Link href="/" className="text-sm font-medium hover:underline text-gray-500">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}