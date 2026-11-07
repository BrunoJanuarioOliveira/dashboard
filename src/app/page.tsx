"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return setErro("Informe um e-mail válido.");
    if (senha.length < 4) return setErro("A senha deve ter ao menos 4 caracteres.");
    setErro("");
    setEnviando(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await res.json();
      if (!res.ok) return setErro(dados.erro ?? "Não foi possível entrar.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 p-4">
    <main className="flex flex-1 items-center justify-center">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl text-slate-800"
      >
        <div className="mb-6 text-center">
          <div className="text-3xl font-bold">
            <span className="text-indigo-600">●</span> DashPC
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Acesse sua conta para continuar
          </p>
        </div>

        <label className="mb-1 block text-sm font-medium">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />

        <label className="mb-1 block text-sm font-medium">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="••••••••"
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />

        {erro && <p className="mb-3 text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          Hackathon • Sistema de Gestão de Produtos
        </p>
      </form>
    </main>
    <Footer claro />
    </div>
  );
}
