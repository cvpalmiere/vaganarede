import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "ADMIN") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const [empresas, empresasRh] = await Promise.all([
    prisma.empresa.findMany({ orderBy: { criadoEm: "desc" }, include: { usuario: { select: { email: true } } } }),
    prisma.empresaRh.findMany({ orderBy: { criadoEm: "desc" }, include: { usuario: { select: { email: true } } } }),
  ]);

  return NextResponse.json({ empresas, empresasRh });
}

const schema = z.object({
  tipo: z.enum(["EMPRESA", "EMPRESA_RH"]),
  id: z.string().uuid(),
  aprovado: z.boolean(),
});

export async function PATCH(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "ADMIN") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados invalidos" }, { status: 400 });
  }

  if (parsed.data.tipo === "EMPRESA") {
    await prisma.empresa.update({ where: { id: parsed.data.id }, data: { aprovado: parsed.data.aprovado } });
  } else {
    await prisma.empresaRh.update({ where: { id: parsed.data.id }, data: { aprovado: parsed.data.aprovado } });
  }

  return NextResponse.json({ ok: true });
}