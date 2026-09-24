import "server-only";

// geocodificacao gratuita via Nominatim (OpenStreetMap) - respeita o limite de uso deles com User-Agent identificado
export async function geocodificarCidade(cidade: string): Promise<{ latitude: number; longitude: number } | null> {
  if (!cidade || cidade.trim().length < 2) return null;

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=" +
      encodeURIComponent(cidade);

    const resposta = await fetch(url, {
      headers: { "User-Agent": "VagasNaRede/1.0 (contato via vagasnarede.com.br)" },
    });
    if (!resposta.ok) return null;

    const dados = await resposta.json();
    if (!dados[0]) return null;

    return { latitude: parseFloat(dados[0].lat), longitude: parseFloat(dados[0].lon) };
  } catch {
    return null;
  }
}
