"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const produtos = [
  { id: 1, nome: "Notebook Gamer 15\"", categoria: "Notebooks", preco: 5499.9, estoque: 12 },
  { id: 2, nome: "Mouse Sem Fio", categoria: "Periféricos", preco: 89.9, estoque: 140 },
  { id: 3, nome: "Teclado Mecânico RGB", categoria: "Periféricos", preco: 249.0, estoque: 56 },
  { id: 4, nome: "Monitor 27\" 144Hz", categoria: "Monitores", preco: 1399.0, estoque: 8 },
  { id: 5, nome: "SSD NVMe 1TB", categoria: "Armazenamento", preco: 459.9, estoque: 33 },
  { id: 6, nome: "Placa de Vídeo RTX", categoria: "Hardware", preco: 3899.0, estoque: 4 },
  { id: 7, nome: "Headset USB", categoria: "Periféricos", preco: 199.9, estoque: 0 },
  { id: 8, nome: "Memória RAM 16GB", categoria: "Hardware", preco: 329.0, estoque: 21 },
];

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Produtos() {
  const [busca, setBusca] = useState("");
  const lista = produtos.filter((p) =>
    (p.nome + p.categoria).toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <Sidebar active="/produtos" />
      <main className="flex flex-1 flex-col p-6 md:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Produtos</h1>
            <p className="text-sm text-slate-500">{lista.length} produtos listados</p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-indigo-600 hover:underline">
            ← Voltar ao dashboard
          </Link>
        </header>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou categoria..."
          className="mb-4 w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Estoque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{p.id}</td>
                  <td className="px-4 py-3 font-medium">{p.nome}</td>
                  <td className="px-4 py-3">{p.categoria}</td>
                  <td className="px-4 py-3">{brl(p.preco)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.estoque === 0
                          ? "bg-red-100 text-red-700"
                          : p.estoque < 10
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {p.estoque === 0 ? "Esgotado" : `${p.estoque} un.`}
                    </span>
                  </td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Nenhum produto encontrado.
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
    </div>
  );
}
