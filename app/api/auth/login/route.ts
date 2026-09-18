import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db'; // Certifique-se que o seu client do prisma está aqui

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ erro: 'Dados inválidos' }, { status: 400 });
    }

    const cookieStore = await cookies();

    // Criamos a resposta base antecipadamente para injetar os cookies do SSR do Supabase nela
    let response = NextResponse.json({ ok: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.senha,
    });

    if (error || !data.user) {
      return NextResponse.json({ erro: 'E-mail ou senha inválidos' }, { status: 401 });
    }

    // Busca o tipo diretamente na tabela 'usuarios' do Prisma para garantir precisão
    const usuarioBanco = await db.usuario.findUnique({
      where: { id: data.user.id },
    });

    const tipo = usuarioBanco?.tipo || data.user.app_metadata?.tipo_usuario || 'CANDIDATO';

    // Retorna a resposta final preservando os cookies de sessão do Supabase nos headers
    return NextResponse.json(
      { ok: true, tipo }, 
      { status: 200, headers: response.headers }
    );

  } catch (err: any) {
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 });
  }
}