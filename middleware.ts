import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ORIGENS_PERMITIDAS = [process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"];

const ROTA_POR_TIPO: Record<string, string> = {
  "/candidato": "CANDIDATO",
  "/empresa": "EMPRESA",
  "/rh": "EMPRESA_RH",
  "/admin": "ADMIN",
};

export async function middleware(request: NextRequest) {
  // 1. Verificação de segurança (CORS) para rotas de API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origem = request.headers.get("origin");
    if (origem && !ORIGENS_PERMITIDAS.includes(origem)) {
      return NextResponse.json({ erro: "Origem nao permitida" }, { status: 403 });
    }
  }

  // 2. Continuação normal do fluxo e verificação de autenticação
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const prefixoProtegido = Object.keys(ROTA_POR_TIPO).find((p) => path.startsWith(p));

  // Bloqueia se a rota é protegida e o usuário não está logado
  if (prefixoProtegido && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se o usuário está logado, valida se ele tem acesso a essa rota (Candidato vs Empresa vs Admin)
  if (prefixoProtegido && user) {
    const tipoEsperado = ROTA_POR_TIPO[prefixoProtegido];
    const tipoReal = user.app_metadata?.tipo_usuario;

    if (tipoReal !== tipoEsperado) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/candidato/:path*", "/api/:path*", "/empresa/:path*", "/rh/:path*", "/admin/:path*"],
};