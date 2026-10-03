import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "CANDIDATO") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const candidato = await prisma.candidato.findUnique({ where: { usuarioId: usuario.id } });
  if (!candidato) return NextResponse.json({ erro: "Candidato nao encontrado" }, { status: 404 });

  // apaga na ordem certa pra nao esbarrar em chave estrangeira
  await prisma.notificacao.deleteMany({ where: { candidatoId: candidato.id } });
  await prisma.matchCompatibilidade.deleteMany({ where: { candidatoId: candidato.id } });
  await prisma.candidatura.deleteMany({ where: { candidatoId: candidato.id } });
  await prisma.documentoCandidato.deleteMany({ where: { candidatoId: candidato.id } });
  await prisma.candidatoSkill.deleteMany({ where: { candidatoId: candidato.id } });
  await prisma.candidato.delete({ where: { id: candidato.id } });
  await prisma.usuario.delete({ where: { id: usuario.id } });

  await supabaseAdmin.auth.admin.deleteUser(usuario.id);

  return NextResponse.json({ ok: true });
}