import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  empresaClienteId: z.string().uuid(),
  titulo: z.string().min(3).max(120),
  descricao: z.string().min(20).max(3000),
  area: z.enum(["TI", "SAUDE", "ADMINISTRATIVO", "COMERCIAL", "MARKETING", "FINANCEIRO", "RH", "ENGENHARIA", "OUTROS"]),
  nivel: z.enum(["ESTAGIO", "TRAINEE", "JUNIOR", "PLENO", "SENIOR"]),
  modelo: z.enum(["REMOTO", "HIBRIDO", "PRESENCIAL"]),
  faixaSalarial: z.enum(["ATE_2000", "DE_2000_A_4000", "DE_4000_A_6000", "DE_6000_A_10000", "ACIMA_DE_10000", "A_COMBINAR"]),
  cidade: z.string().min(2),
});

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA_RH") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const empresaRh = await prisma.empresaRh.findUnique({ where: { usuarioId: usuario.id } });
  if (!empresaRh) return NextResponse.json({ erro: "Nao encontrado" }, { status: 404 });

  const vagas = await prisma.vaga.findMany({
    where: { empresa: { empresaRhId: empresaRh.id } },
    include: { empresa: { select: { razaoSocial: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json({ vagas });
}

export async function POST(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA_RH") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const empresaRh = await prisma.empresaRh.findUnique({
    where: { usuarioId: usuario.id },
    include: { assinatura: true },
  });
  if (empresaRh?.assinatura?.status !== "ATIVO") {
    return NextResponse.json({ erro: "Assinatura inativa" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
  }

  // confirma que a empresa-cliente informada pertence mesmo a essa RH - trava contra criar vaga em cliente de outra RH
  const empresaCliente = await prisma.empresa.findFirst({
    where: { id: parsed.data.empresaClienteId, empresaRhId: empresaRh.id },
  });
  if (!empresaCliente) return NextResponse.json({ erro: "Empresa-cliente nao encontrada" }, { status: 404 });

  const { empresaClienteId, ...dadosVaga } = parsed.data;
  const vaga = await prisma.vaga.create({
    data: { ...dadosVaga, empresaId: empresaClienteId, latitude: 0, longitude: 0, status: "ATIVA" },
  });

  return NextResponse.json({ ok: true, vaga });
}