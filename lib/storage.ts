import 'server-only';
import { supabaseAdmin } from '@/lib/supabase';

const BUCKET = 'documentos-candidatos';

// gera uma url de upload valida por tempo limitado, ja isolada na pasta do usuario
export async function gerarUrlUploadDocumento(usuarioId: string, extensao: string) {
  const nomeArquivo = `${usuarioId}/${Date.now()}.${extensao}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(nomeArquivo);

  if (error || !data) throw new Error('Falha ao gerar URL de upload');

  return { url: data.signedUrl, token: data.token, storagePath: nomeArquivo };
}