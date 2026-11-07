import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const cards = [
  { titulo: "Vendas no mês", valor: "R$ 48.920", var: "+12,4%", cor: "text-emerald-600" },
  { titulo: "Pedidos", valor: "342", var: "+5,1%", cor: "text-emerald-600" },
  { titulo: "Produtos em estoque", valor: "1.286", var: "-2,3%", cor: "text-red-600" },
  { titulo: "Novos clientes", valor: "87", var: "+18,9%", cor: "text-emerald-600" },
];

const vendas = [
  { mes: "Mai", v: 42 },
  { mes: "Jun", v: 55 },
  { mes: "Jul", v: 48 },
  { mes: "Ago", v: 70 },
  { mes: "Set", v: 62 },
  { mes: "Out", v: 88 },
];

const recentes = [
  { id: "#1042", cliente: "Ana Souza", valor: "R$ 1.299", status: "Pago" },
  { id: "#1041", cliente: "Carlos Lima", valor: "R$ 459", status: "Pendente" },
  { id: "#1040", cliente: "Marina Alves", valor: "R$ 3.890", status: "Pago" },
  { id: "#1039", cliente: "João Pereira", valor: "R$ 219", status: "Cancelado" },
];

const badge: Record<string, string> = {
  Pago: "bg-emerald-100 text-emerald-700",
  Pendente: "bg-amber-100 text-amber-700",
  Cancelado: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <Sidebar active="/dashboard" />
      <main className="flex flex-1 flex-col p-6 md:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-500">Visão geral da sua loja</p>
          </div>
          <Link
            href="/produtos"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Ver lista de produtos →
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <div key={c.titulo} className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{c.titulo}</p>
              <p className="mt-2 text-2xl font-bold">{c.valor}</p>
              <p className={`mt-1 text-sm font-medium ${c.cor}`}>
                {c.var} vs. mês anterior
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="mb-4 font-semibold">Vendas (mil R$)</h2>
            <div className="flex h-56 items-end gap-3">
              {vendas.map((d) => (
                <div key={d.mes} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs text-slate-500">{d.v}</span>
                  <div
                    className="w-full rounded-t-md bg-indigo-500"
                    style={{ height: `${d.v * 2}px` }}
                  />
                  <span className="text-xs font-medium">{d.mes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="mb-4 font-semibold">Pedidos recentes</h2>
            <ul className="divide-y divide-slate-100">
              {recentes.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{p.cliente}</p>
                    <p className="text-xs text-slate-400">{p.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{p.valor}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${badge[p.status]}`}>
                      {p.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <div className="pt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
}
