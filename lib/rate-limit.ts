import "server-only";

type Registro = { tentativas: number; resetEm: number };
const registros = new Map<string, Registro>();

// limite simples em memoria - por IP + rota. Funciona bem para 1 instancia de servidor;
// se o projeto escalar para multiplas instancias (ex: varias regioes na Vercel), substituir por Redis compartilhado (ex: Upstash)
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
