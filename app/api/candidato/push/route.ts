import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "CANDIDATO") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const subscription = await request.json();

  await prisma.candidato.update({
    where: { usuarioId: usuario.id },
    data: { pushSubscription: JSON.stringify(subscription) },
  });

  return NextResponse.json({ ok: true });
}