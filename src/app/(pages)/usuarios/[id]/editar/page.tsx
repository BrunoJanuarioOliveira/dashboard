"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/Footer";
import UsuarioForm from "../../../../components/UsuarioForm";
import { buscarUsuario, type Usuario } from "../../../../lib/usuarios";

export default function EditarUsuario() {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarUsuario(id)
      .then(setUsuario)
      .catch(() => setErro("Usuário não encontrado ou API indisponível (npm run api)."));
  }, [id]);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <Sidebar active="/usuarios" />
      <main className="flex flex-1 flex-col p-6 md:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Editar usuário</h1>
            <p className="text-sm text-slate-500">Altere os dados e salve</p>
          </div>
          <Link href="/usuarios" className="text-sm font-medium text-indigo-600 hover:underline">
            ← Voltar à listagem
          </Link>
        </header>

        {erro && <p className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">{erro}</p>}
        {!usuario && !erro && <p className="text-sm text-slate-400">Carregando...</p>}
        {usuario && <UsuarioForm usuario={usuario} />}

        <div className="pt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
}
