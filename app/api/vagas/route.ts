import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// formula de haversine - calcula distancia em km entre duas coordenadas
function distanciaKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const area = searchParams.get("area");
  const nivel = searchParams.get("nivel");
  const modelo = searchParams.get("modelo");
  const faixaSalarial = searchParams.get("faixaSalarial");
  const cidade = searchParams.get("cidade");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const raioKm = searchParams.get("raioKm");

  const vagas = await prisma.vaga.findMany({
    where: {
      status: "ATIVA",
      ...(area ? { area: area as never } : {}),
      ...(nivel ? { nivel: nivel as never } : {}),
      ...(modelo ? { modelo: modelo as never } : {}),
      ...(faixaSalarial ? { faixaSalarial: faixaSalarial as never } : {}),
      ...(cidade ? { cidade: { contains: cidade, mode: "insensitive" } } : {}),
    },
    include: { empresa: { select: { razaoSocial: true } } },
    orderBy: { criadoEm: "desc" },
  });

  // filtro de raio so entra em acao quando lat/lng/raioKm sao enviados E a vaga tem coordenada real -
  // hoje toda vaga nasce com 0,0 (geocodificacao ainda nao implementada), entao esse filtro nao teria efeito util ate isso mudar
  const vagasFiltradas = lat && lng && raioKm
    ? vagas.filter((v) => {
        if (v.latitude === 0 && v.longitude === 0) return true;
        return distanciaKm(Number(lat), Number(lng), v.latitude, v.longitude) <= Number(raioKm);
      })
    : vagas;

  return NextResponse.json({ vagas: vagasFiltradas });
}