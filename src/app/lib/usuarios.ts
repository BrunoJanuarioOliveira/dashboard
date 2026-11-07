// Tipos e cliente da API (JSON Server) para o CRUD de usuários

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const ENDPOINT = `${API_URL}/usuarios`;

export type Usuario = {
  id: number | string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string; // dd/mm/aaaa
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  senha: string;
};

export type UsuarioInput = Omit<Usuario, "id">;

async function tratar<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Erro na API (${res.status})`);
  return res.json() as Promise<T>;
}

export async function listarUsuarios(): Promise<Usuario[]> {
  return tratar<Usuario[]>(await fetch(ENDPOINT, { cache: "no-store" }));
}

export async function buscarUsuario(id: string | number): Promise<Usuario> {
  return tratar<Usuario>(await fetch(`${ENDPOINT}/${id}`, { cache: "no-store" }));
}

export async function criarUsuario(dados: UsuarioInput): Promise<Usuario> {
  return tratar<Usuario>(
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
  );
}

export async function atualizarUsuario(id: string | number, dados: UsuarioInput): Promise<Usuario> {
  return tratar<Usuario>(
    await fetch(`${ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
  );
}

export async function excluirUsuario(id: string | number): Promise<void> {
  const res = await fetch(`${ENDPOINT}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Erro na API (${res.status})`);
}

/** Verifica se já existe outro usuário com o mesmo valor em `campo` (cpf ou email). */
export async function valorJaExiste(
  campo: "cpf" | "email",
  valor: string,
  ignorarId?: string | number
): Promise<boolean> {
  const res = await fetch(`${ENDPOINT}?${campo}=${encodeURIComponent(valor)}`, {
    cache: "no-store",
  });
  const lista = await tratar<Usuario[]>(res);
  return lista.some((u) => String(u.id) !== String(ignorarId));
}
