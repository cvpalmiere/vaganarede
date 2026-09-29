import "server-only";
import { prisma } from "@/lib/prisma";

type TipoEvento = "NOVA_CANDIDATURA" | "MUDANCA_STATUS" | "VAGA_COMPATIVEL";

const TEMPLATES: Record<TipoEvento, (dados: Record<string, string>) => { titulo: string; mensagem: string }> = {
  NOVA_CANDIDATURA: (d) => ({
    titulo: "Nova candidatura recebida",
    mensagem: `Você se candidatou para ${d.tituloVaga} em ${d.empresa}.`,
  }),
  MUDANCA_STATUS: (d) => ({
    titulo: "Status da candidatura atualizado",
    mensagem: `Sua candidatura para ${d.tituloVaga} agora está: ${d.status}.`,
  }),
  VAGA_COMPATIVEL: (d) => ({
    titulo: "Nova vaga compatível com seu perfil",
    mensagem: `${d.tituloVaga} em ${d.empresa} tem ${d.score}% de compatibilidade com você.`,
  }),
};

// registra a notificacao no banco - o disparo real (email/push/whatsapp) e feito por processos separados que leem essa tabela
export async function criarNotificacao(
  candidatoId: string,
  tipo: TipoEvento,
  dados: Record<string, string>,
  canal: "PUSH" | "WHATSAPP" | "EMAIL" = "PUSH"
) {
  const { titulo, mensagem } = TEMPLATES[tipo](dados);

  return prisma.notificacao.create({
    data: { candidatoId, canal, titulo, mensagem },
  });
}