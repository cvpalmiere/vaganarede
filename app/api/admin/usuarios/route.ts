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

// NOVA FUNÇÃO: Exclui o usuário do banco de dados
export async function DELETE(request: Request) {
  const usuarioAdmin = await getSessionUser();
  if (!usuarioAdmin || usuarioAdmin.tipo !== "ADMIN") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await request.json();

  try {
    // O cascade do Prisma apagará automaticamente os dados vinculados (Candidato/Empresa)
    await prisma.usuario.delete({
      where: { id },
    });
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao excluir usuário" }, { status: 500 });
  }
}