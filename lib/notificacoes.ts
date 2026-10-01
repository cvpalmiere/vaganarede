import "server-only";
import { prisma } from "@/lib/prisma";
import { enviarEmail } from "@/lib/email";

type TipoEvento = "NOVA_CANDIDATURA" | "MUDANCA_STATUS" | "VAGA_COMPATIVEL";

const TEMPLATES: Record<TipoEvento, (dados: Record<string, string>) => { titulo: string; mensagem: string }> = {
  NOVA_CANDIDATURA: (d) => ({
    titulo: "Nova candidatura recebida",
    mensagem: `Você se candidatou para ${d.tituloVaga}${d.empresa ? " em " + d.empresa : ""}.`,
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

function montarHtml(titulo: string, mensagem: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <div style="background: #000; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <span style="color: #FFE500; font-weight: bold; font-size: 18px;">Vagas na Rede</span>
      </div>
      <h2 style="color: #111; margin-bottom: 8px;">${titulo}</h2>
      <p style="color: #444; line-height: 1.5;">${mensagem}</p>
      <a href="https://vagasnarede.com.br/candidato" style="display: inline-block; margin-top: 16px; background: #FFE500; color: #000; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
        Ver no painel
      </a>
    </div>
  `;
}

// registra no banco e, se o candidato tiver email, dispara o envio tambem - as duas coisas sao independentes,
// uma falhar nao bloqueia a outra
export async function criarNotificacao(
  candidatoId: string,
  tipo: TipoEvento,
  dados: Record<string, string>,
  canal: "PUSH" | "WHATSAPP" | "EMAIL" = "EMAIL"
) {
  const { titulo, mensagem } = TEMPLATES[tipo](dados);

  const notificacao = await prisma.notificacao.create({
    data: { candidatoId, canal, titulo, mensagem },
  });

  if (canal === "EMAIL") {
    const candidato = await prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: { usuario: true },
    });
    if (candidato?.usuario?.email) {
      await enviarEmail(candidato.usuario.email, titulo, montarHtml(titulo, mensagem));
    }
  }

  return notificacao;
}
