import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmail(para: string, assunto: string, corpoHtml: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: para,
      subject: assunto,
      html: corpoHtml,
    });
  } catch {
    // falha no envio de email nunca deve quebrar o fluxo principal (candidatura, mudanca de status, etc.)
  }
}
