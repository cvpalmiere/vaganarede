import "server-only";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:contato@vagasnarede.com.br",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function enviarPush(subscriptionJson: string, titulo: string, mensagem: string) {
  try {
    const subscription = JSON.parse(subscriptionJson);
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title: titulo, body: mensagem, url: "/candidato" })
    );
  } catch {
    // inscricao pode ter expirado ou o navegador estar fechado - nao deve quebrar o fluxo principal
  }
}