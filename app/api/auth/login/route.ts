import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const parsed = z.object({ email: z.string().email(), senha: z.string().min(1) }).safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  const { email, senha } = parsed.data;
  const cookieStore = await cookies();
  
  // 1. Criamos uma resposta temporária que servirá como um "cofre" inquebrável para os cookies
  const tempResponse = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Tenta gravar no servidor
            try { cookieStore.set(name, value, options); } catch (e) {}
            
            // FORÇA a criação do cabeçalho Set-Cookie no nosso "cofre" (Isto garante que vai para o navegador)
            tempResponse.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 401 });
  }

  // 2. Retornamos a resposta de sucesso injetando os cabeçalhos que guardamos!
  return NextResponse.json(
    { ok: true, tipo: data.user?.app_metadata?.tipo_usuario },
    { headers: tempResponse.headers } 
  );
}