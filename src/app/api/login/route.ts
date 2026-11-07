import { NextResponse } from "next/server";
import { API_URL } from "../../lib/usuarios";
import { COOKIE_NAME, TOKEN_TTL_SEGUNDOS, criarToken } from "../../lib/auth";

type UsuarioDb = { id: number | string; nome: string; email: string; senha: string };

export async function POST(req: Request) {
  const { email, senha } = (await req.json().catch(() => ({}))) as {
    email?: string;
    senha?: string;
  };

  if (!email || !senha) {
    return NextResponse.json({ erro: "Informe e-mail e senha." }, { status: 400 });
  }

  let usuarios: UsuarioDb[];
  try {
    const res = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error();
    usuarios = await res.json();
  } catch {
    return NextResponse.json(
      { erro: "API indisponível. Verifique se ela está rodando (npm run api)." },
      { status: 502 }
    );
  }

  const usuario = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!usuario || usuario.senha !== senha) {
    return NextResponse.json({ erro: "E-mail ou senha inválidos." }, { status: 401 });
  }

  const token = await criarToken(usuario);
  const resposta = NextResponse.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
  });

  // Token guardado em cookie httpOnly: o JavaScript do navegador não consegue lê-lo.
  resposta.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_TTL_SEGUNDOS,
  });
  return resposta;
}
