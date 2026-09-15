import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROTA_POR_TIPO: Record<string, string> = {
  "/candidato": "CANDIDATO",
  "/empresa": "EMPRESA",
  "/rh": "EMPRESA_RH",
  "/admin": "ADMIN",
};

export async function middleware(request: NextRequest) {
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

  if (prefixoProtegido && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
  matcher: ["/candidato/:path*", "/empresa/:path*", "/rh/:path*", "/admin/:path*"],
};
