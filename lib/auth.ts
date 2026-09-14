import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

// le a sessao a partir dos cookies da requisicao - unico jeito seguro em server components/route handlers
export async function getSessionUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // nao seta cookie aqui - middleware ja cuida do refresh de sessao
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // busca o tipo de usuario no nosso banco, nao confia so no metadata do auth
  const usuario = await prisma.usuario.findUnique({ where: { id: user.id } });
  return usuario;
}