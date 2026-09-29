import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "ADMIN") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const assinaturas = await prisma.assinatura.findMany({
    include: {
      empresa: { select: { razaoSocial: true } },
      empresaRh: { select: { razaoSocial: true } },
    },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json({ assinaturas });
}