"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { excluirUsuario, listarUsuarios, type Usuario } from "../../lib/usuarios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [aExcluir, setAExcluir] = useState<Usuario | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch(() => setErro("Não foi possível carregar os usuários. Verifique se a API está rodando (npm run api)."))
      .finally(() => setCarregando(false));
  }, []);

  async function confirmarExclusao() {
    if (!aExcluir) return;
    setExcluindo(true);
    try {
      await excluirUsuario(aExcluir.id);
      setUsuarios((lista) => lista.filter((u) => u.id !== aExcluir.id));
      setAExcluir(null);
    } catch {
      setErro("Erro ao excluir o usuário.");
      setAExcluir(null);
    } finally {
      setExcluindo(false);
    }
  }

  const termo = busca.toLowerCase();
  const lista = usuarios.filter((u) =>
    (u.nome + u.email + u.cpf + u.cidade).toLowerCase().includes(termo)
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <Sidebar active="/usuarios" />
      <main className="flex flex-1 flex-col p-6 md:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Usuários</h1>
            <p className="text-sm text-slate-500">{lista.length} usuários listados</p>
          </div>
          <Link
            href="/usuarios/novo"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Novo usuário
          </Link>
        </header>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail, CPF ou cidade..."
          className="mb-4 w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />

        {erro && (
          <p className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">{erro}</p>
        )}

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">CPF</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Nascimento</th>
                <th className="px-4 py-3">Cidade/UF</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{u.id}</td>
                  <td className="px-4 py-3 font-medium">{u.nome}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{u.cpf}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{u.telefone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{u.dataNascimento}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {u.cidade}/{u.uf}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/usuarios/${u.id}/editar`}
                        className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => setAExcluir(u)}
                        className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!carregando && lista.length === 0 && !erro && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
              {carregando && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Carregando...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-8">
          <Footer />
        </div>
      </main>

      {aExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold">Excluir usuário</h2>
            <p className="mt-2 text-sm text-slate-600">
              Tem certeza que deseja excluir <strong>{aExcluir.nome}</strong>? Essa ação não pode ser
              desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setAExcluir(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                disabled={excluindo}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {excluindo ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
