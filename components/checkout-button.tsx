'use client';

import { useState } from 'react';

export function CheckoutButton() {
  const [carregando, setCarregando] = useState(false);

  async function iniciarCheckout() {
    setCarregando(true);
    const resposta = await fetch('/api/stripe/checkout', { method: 'POST' });
    const dados = await resposta.json();

    if (dados.url) {
      window.location.href = dados.url;
      return;
    }

    setCarregando(false);
  }

  return (
    <button
      onClick={iniciarCheckout}
      disabled={carregando}
      className="w-full bg-electric-yellow text-deep-black font-bold py-4 rounded-lg hover:bg-electric-yellow-dark transition disabled:opacity-50"
    >
      {carregando ? 'Redirecionando...' : 'Assinar agora'}
    </button>
  );
}