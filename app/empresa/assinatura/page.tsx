import { CheckoutButton } from '@/components/checkout-button';

export default function AssinaturaEmpresaPage() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="glass rounded-card p-10 border border-white max-w-md text-center">
        <h1 className="text-2xl font-bold text-deep-black mb-3">Ative seu plano</h1>
        <p className="text-gray-600 mb-8">
          Publique vagas e consulte o banco de currículos ranqueado por compatibilidade.
        </p>
        <CheckoutButton />
      </div>
    </div>
  );
}