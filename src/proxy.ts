import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verificarToken } from "./app/lib/auth";

// Roda antes de cada página. Sem token válido, só a tela de login ("/") é acessível.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const logado = await verificarToken(req.cookies.get(COOKIE_NAME)?.value);

  if (pathname === "/") {
    // Já autenticado não precisa ver o login de novo.
    if (logado) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (!logado) {
    const resposta = NextResponse.redirect(new URL("/", req.url));
    resposta.cookies.delete(COOKIE_NAME); // limpa token expirado/adulterado
    return resposta;
  }

  return NextResponse.next();
}

export const config = {
  // Tudo, exceto API, arquivos internos do Next e arquivos estáticos.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
