import 'server-only';
import crypto from 'crypto';

// hash determinístico - usado só pra unicidade/busca, nunca reversível
export function hashDocumento(valor: string) {
  const salt = process.env.DOCUMENT_HASH_SALT!;
  return crypto.createHmac('sha256', salt).update(valor.replace(/\D/g, '')).digest('hex');
}

// AES-256-GCM - reversível, usado quando precisamos exibir o dado real depois (ex: admin conferindo documento)
const ALGORITHM = 'aes-256-gcm';

export function encryptDocumento(valorPlano: string) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(valorPlano, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // formato: iv:authTag:encrypted, tudo em hex, pra caber num unico campo texto
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptDocumento(valorCriptografado: string) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const [ivHex, authTagHex, encryptedHex] = valorCriptografado.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}