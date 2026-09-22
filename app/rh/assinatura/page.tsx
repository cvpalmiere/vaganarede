import { CheckoutButton } from "@/components/checkout-button";

export default function AssinaturaRhPage() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="glass rounded-card p-10 border border-white max-w-md text-center">
        <h1 className="text-2xl font-bold text-deep-black mb-3">Ative seu plano</h1>
        <p className="text-gray-600 mb-8">
          Gerencie vagas e candidatos de varias empresas-cliente em um painel so.
        </p>
        <CheckoutButton />
      </div>
    </div>
  );
}
