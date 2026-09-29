import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "ADMIN") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: "desc" },
    take: 100,
  });

  return NextResponse.json({ usuarios });
}