import "server-only";

export async function enviarWhatsapp(telefone: string, mensagem: string) {
  const numeroLimpo = telefone.replace(/\D/g, "");
  const numeroComPais = numeroLimpo.startsWith("55") ? numeroLimpo : "55" + numeroLimpo;

  try {
    await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: numeroComPais,
        type: "text",
        text: { body: mensagem },
      }),
    });
  } catch {
    // falha no envio de whatsapp nunca deve quebrar o fluxo principal
  }
}
