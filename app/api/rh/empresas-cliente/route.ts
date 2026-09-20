import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashDocumento, encryptDocumento } from "@/lib/crypto";
import { validarCnpj } from "@/lib/cnpj";

async function empresaRhAtiva(usuarioId: string) {
  const empresaRh = await prisma.empresaRh.findUnique({
    where: { usuarioId },
    include: { assinatura: true },
  });
  if (!empresaRh || empresaRh.assinatura?.status !== "ATIVO") return null;
  return empresaRh;
}

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA_RH") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const empresaRh = await empresaRhAtiva(usuario.id);
  if (!empresaRh) return NextResponse.json({ erro: "Assinatura inativa" }, { status: 403 });

  const empresasCliente = await prisma.empresa.findMany({
    where: { empresaRhId: empresaRh.id },
    include: { _count: { select: { vagas: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json({ empresasCliente });
}

const schema = z.object({
  razaoSocial: z.string().min(2),
  cnpj: z.string().min(14),
  telefone: z.string().min(10),
  cidade: z.string().min(2),
});

export async function POST(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "EMPRESA_RH") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const empresaRh = await empresaRhAtiva(usuario.id);
  if (!empresaRh) return NextResponse.json({ erro: "Assinatura inativa" }, { status: 403 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados invalidos", detalhes: parsed.error.flatten() }, { status: 400 });
  }

  if (!validarCnpj(parsed.data.cnpj)) {
    return NextResponse.json({ erro: "CNPJ invalido" }, { status: 400 });
  }

  try {
    const empresaCliente = await prisma.empresa.create({
      data: {
        razaoSocial: parsed.data.razaoSocial,
        cnpjHash: hashDocumento(parsed.data.cnpj),
        cnpjCriptografado: encryptDocumento(parsed.data.cnpj),
        telefone: parsed.data.telefone,
        cidade: parsed.data.cidade,
        empresaRhId: empresaRh.id,
        // usuarioId fica nulo de proposito - essa empresa nao faz login, so a RH acessa
      },
    });
    return NextResponse.json({ ok: true, empresaCliente });
  } catch {
    return NextResponse.json({ erro: "CNPJ ja cadastrado" }, { status: 409 });
  }
}