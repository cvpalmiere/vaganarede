import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  console.log("🟢 [LOGIN] 1. Iniciando requisição de login...");

  const parsed = z.object({ email: z.string().email(), senha: z.string().min(1) }).safeParse(await request.json());
  if (!parsed.success) {
    console.log("🔴 [LOGIN] 2. Falha: Dados inválidos recebidos.");
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  const { email, senha } = parsed.data;
  console.log(`🟡 [LOGIN] 3. Tentando autenticar o email: ${email}`);

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
            console.log("🟢 [LOGIN] 4. Cookies de sessão injetados com sucesso.");
          } catch (error) {
            console.log("🔴 [LOGIN] Erro ao setar cookies:", error);
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    console.log("🔴 [LOGIN] 5. Erro no Supabase:", error.message);
    return NextResponse.json({ erro: error.message }, { status: 401 });
  }

  console.log("🟢 [LOGIN] 6. Sucesso total! Redirecionando usuário tipo:", data.user?.app_metadata?.tipo_usuario);
  return NextResponse.json({ ok: true, tipo: data.user?.app_metadata?.tipo_usuario });
}