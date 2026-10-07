import "server-only";

type Registro = { tentativas: number; resetEm: number };
const registros = new Map<string, Registro>();

export function verificarLimite(chave: string, maxTentativas: number, janelaMs: number): boolean {
  const agora = Date.now();
  const registro = registros.get(chave);

  if (!registro || agora > registro.resetEm) {
    registros.set(chave, { tentativas: 1, resetEm: agora + janelaMs });
    return true;
  }

  if (registro.tentativas >= maxTentativas) {
    return false;
  }

  registro.tentativas += 1;
  return true;
}

export function obterIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "desconhecido";
}

// bypass EXCLUSIVO para testes automatizados - so funciona se a env E2E_BYPASS_KEY existir no servidor
// E o header bater com ela. Em producao essa env nunca e definida, entao o bypass fica permanentemente desligado la.
export function requisicaoEhDeTesteE2E(request: Request): boolean {
  const chaveServidor = process.env.E2E_BYPASS_KEY;
  if (!chaveServidor) return false;
  return request.headers.get("x-e2e-bypass") === chaveServidor;
}
