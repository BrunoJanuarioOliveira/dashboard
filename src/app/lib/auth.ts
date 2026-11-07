// Autenticação por token (JWT HS256) usando apenas Web Crypto.
// Funciona tanto no proxy quanto nas rotas de API, sem dependências extras.

export const COOKIE_NAME = "dashpc_token";
export const TOKEN_TTL_SEGUNDOS = 60 * 60; // 1 hora

// Em produção defina AUTH_SECRET no .env.local. O valor abaixo é só para desenvolvimento.
const SECRET = process.env.AUTH_SECRET ?? "dev-secret-troque-em-producao";

export type TokenPayload = {
  sub: string; // id do usuário
  nome: string;
  email: string;
  iat: number;
  exp: number;
};

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function chave(usos: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, usos);
}

/** Gera um token assinado para o usuário. */
export async function criarToken(u: { id: string | number; nome: string; email: string }): Promise<string> {
  const agora = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    sub: String(u.id),
    nome: u.nome,
    email: u.email,
    iat: agora,
    exp: agora + TOKEN_TTL_SEGUNDOS,
  };
  const header = b64url(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const corpo = b64url(enc.encode(JSON.stringify(payload)));
  const assinatura = await crypto.subtle.sign("HMAC", await chave(["sign"]), enc.encode(`${header}.${corpo}`));
  return `${header}.${corpo}.${b64url(new Uint8Array(assinatura))}`;
}

/** Retorna o payload se o token for autêntico e não estiver expirado; senão, null. */
export async function verificarToken(token: string | undefined): Promise<TokenPayload | null> {
  if (!token) return null;
  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const [header, corpo, assinatura] = partes;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await chave(["verify"]),
      fromB64url(assinatura) as BufferSource,
      enc.encode(`${header}.${corpo}`)
    );
    if (!ok) return null;
    const payload = JSON.parse(dec.decode(fromB64url(corpo))) as TokenPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
