import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { verificarLimite, obterIp, requisicaoEhDeTesteE2E } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export async function POST(request: Request) {
  const ip = obterIp(request);
  if (!requisicaoEhDeTesteE2E(request) && !verificarLimite(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ erro: "Muitas tentativas. Tente novamente em alguns minutos." }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados invalidos" }, { status: 400 });
  }

  const { email, senha } = parsed.data;
  const cookieStore = await cookies();
  const response = NextResponse.json({ ok: true });

  // Fluxo nativo e seguro via Supabase (que cria os cookies automaticamente)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error || !data.user) {
    return NextResponse.json(
      {
        erro: "Email ou senha invalidos",
        ...(process.env.NODE_ENV !== "production" ? { detalheReal: error?.message } : {}),
      },
      { status: 401 }
    );
  }

  const tipo = data.user.app_metadata?.tipo_usuario;
  return NextResponse.json({ ok: true, tipo }, { headers: response.headers });
}