import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptDocumento } from "@/lib/crypto";

export async function GET() {
  const usuario = await getSessionUser();
  if (!usuario || usuario.tipo !== "CANDIDATO") {
    return NextResponse.json({ erro: "Nao autorizado" }, { status: 401 });
  }

  const candidato = await prisma.candidato.findUnique({
    where: { usuarioId: usuario.id },
    include: {
      skills: { include: { skill: true } },
      documentos: true,
      candidaturas: { include: { vaga: { select: { titulo: true } } } },
    },
  });
  if (!candidato) return NextResponse.json({ erro: "Candidato nao encontrado" }, { status: 404 });

  const dadosExportados = {
    dadosPessoais: {
      nomeCompleto: candidato.nomeCompleto,
      email: usuario.email,
      cpf: decryptDocumento(candidato.cpfCriptografado),
      telefone: candidato.telefone,
      cidade: candidato.cidade,
      escolaridade: candidato.escolaridade,
      curso: candidato.curso,
      linkedinUrl: candidato.linkedinUrl,
      githubUrl: candidato.githubUrl,
      resumoProfissional: candidato.resumoProfissional,
    },
    habilidades: candidato.skills.map((s) => ({ nome: s.skill.nome, nivel: s.nivel })),
    documentosEnviados: candidato.documentos.map((d) => ({ tipo: d.tipo, status: d.status, enviadoEm: d.criadoEm })),
    candidaturas: candidato.candidaturas.map((c) => ({ vaga: c.vaga.titulo, status: c.status, data: c.criadaEm })),
    exportadoEm: new Date().toISOString(),
  };

  return new NextResponse(JSON.stringify(dadosExportados, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=meus-dados-vagasnarede.json",
    },
  });
}