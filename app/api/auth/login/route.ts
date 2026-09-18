import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

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

    const usuarioBanco = await prisma.usuario.findUnique({
      where: { id: data.user.id },
    });

    const tipo = usuarioBanco?.tipo || data.user.app_metadata?.tipo_usuario || 'CANDIDATO';

    return NextResponse.json(
      { ok: true, tipo }, 
      { status: 200, headers: response.headers }
    );

  } catch (err: any) {
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 });
  }
}