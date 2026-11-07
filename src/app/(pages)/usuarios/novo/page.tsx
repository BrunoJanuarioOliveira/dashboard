import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
import Footer from "../../../components/Footer";
import UsuarioForm from "../../../components/UsuarioForm";

export default function NovoUsuario() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <Sidebar active="/usuarios" />
      <main className="flex flex-1 flex-col p-6 md:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Novo usuário</h1>
            <p className="text-sm text-slate-500">Preencha os dados para cadastrar</p>
          </div>
          <Link href="/usuarios" className="text-sm font-medium text-indigo-600 hover:underline">
            ← Voltar à listagem
          </Link>
        </header>
        <UsuarioForm />
        <div className="pt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
}
