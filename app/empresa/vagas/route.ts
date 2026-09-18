import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  titulo: z.string().min(3).max(120),
  descricao: z.string().min(20).max(3000),
  area: z.enum(["TI", "SAUDE", "ADMINISTRATIVO", "COMERCIAL", "MARKETING", "FINANCEIRO", "RH", "ENGENHARIA", "OUTROS"]),
  nivel: z.enum(["ESTAGIO", "TRAINEE", "JUNIOR", "PLENO", "SENIOR"]),
  modelo: z.enum(["REMOTO", "HIBRIDO", "PRESENCIAL"]),
  faixaSalarial: z.enum(["ATE_2000", "DE_2000_A_4000", "DE_4000_A_6000", "DE_6000_A_10000", "ACIMA_DE_10000", "A_COMBINAR"]),
  cidade: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
});

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const empresa = await prisma.empresa.findUnique({ where: { usuarioId: usuario.id } });
  if (!empresa) return NextResponse.json({ erro: "Empresa nao encontrada" }, { status: 404 });

  const vagas = await prisma.vaga.findMany({
    where: { empresaId: empresa.id },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json({ vagas });
}

export async function POST(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const empresa = await prisma.empresa.findUnique({
    where: { usuarioId: usuario.id },
    include: { assinatura: true },
  });
  if (!empresa) return NextResponse.json({ erro: "Empresa nao encontrada" }, { status: 404 });

  // trava redundante de proposito - mesmo que alguem burle o layout no front-end, a api tambem checa
  if (empresa.assinatura?.status !== "ATIVO") {
    return NextResponse.json({ erro: "Assinatura inativa" }, { status: 403 });
  }

  const vaga = await prisma.vaga.create({
    data: { ...parsed.data, empresaId: empresa.id, status: "ATIVA" },
  });

  return NextResponse.json({ ok: true, vaga });
}