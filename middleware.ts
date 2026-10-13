import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROTA_POR_TIPO: Record<string, string> = {
  "/candidato": "CANDIDATO",
  "/empresa": "EMPRESA",
  "/rh": "EMPRESA_RH",
  "/admin": "ADMIN",
};

export async function middleware(request: NextRequest) {
  // 1. Verificação de segurança (CORS) Flexível e Inteligente
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origem = request.headers.get("origin");
    if (origem) {
      try {
        const host = new URL(origem).hostname;
        // Aceita localhost E qualquer variação do seu domínio (com ou sem www)
        if (host !== "localhost" && !host.endsWith("vagasnarede.com.br")) {
          return NextResponse.json({ erro: "Origem nao permitida" }, { status: 403 });
        }
      } catch (e) {
        return NextResponse.json({ erro: "Origem invalida" }, { status: 403 });
      }
    }
  }

  // 2. Fluxo Oficial do Supabase para manter a sessão sincronizada
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          // Atualiza os cookies na requisição atual para o Supabase ler
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Atualiza o objeto de resposta
          supabaseResponse = NextResponse.next({ request });
          // Injeta os cookies renovados na resposta final que vai para o navegador
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // O getUser() renova o token se necessário e aplica os cookies no supabaseResponse
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const prefixoProtegido = Object.keys(ROTA_POR_TIPO).find((p) => path.startsWith(p));

  // 3. Lógica de Redirecionamento à prova de balas (Repassando os cookies)
  if (prefixoProtegido) {
    let redirectUrl: string | null = null;

    if (!user) {
      redirectUrl = "/login";
    } else {
      const tipoEsperado = ROTA_POR_TIPO[prefixoProtegido];
      const tipoReal = user.app_metadata?.tipo_usuario;
      if (tipoReal !== tipoEsperado) {
        redirectUrl = "/";
      }
    }

    // Se precisar redirecionar, TEMOS que colar os cookies na nova resposta
    if (redirectUrl) {
      const redirectRes = NextResponse.redirect(new URL(redirectUrl, request.url));
      
      // Extrai os cookies seguros que o Supabase gerou e os injeta no redirecionamento
      const setCookieHeaders = supabaseResponse.headers.getSetCookie();
      for (const header of setCookieHeaders) {
        redirectRes.headers.append("Set-Cookie", header);
      }
      
      return redirectRes;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/candidato/:path*", "/api/:path*", "/empresa/:path*", "/rh/:path*", "/admin/:path*"],
};