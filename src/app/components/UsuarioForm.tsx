"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  maskCEP,
  maskCPF,
  maskData,
  maskTelefone,
  validarCEP,
  validarConfirmacao,
  validarCPF,
  validarData,
  validarEmail,
  validarNome,
  validarSenha,
  validarTelefone,
} from "../lib/masks";
import {
  atualizarUsuario,
  criarUsuario,
  valorJaExiste,
  type Usuario,
  type UsuarioInput,
} from "../lib/usuarios";

type Campos = UsuarioInput & { confirmarSenha: string };
type Erros = Partial<Record<keyof Campos, string>>;

const vazio: Campos = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
  dataNascimento: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  senha: "",
  confirmarSenha: "",
};

const inputCls = (erro?: string) =>
  `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
    erro
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
  }`;

function Campo({
  label,
  erro,
  className = "",
  children,
}: {
  label: string;
  erro?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}

export default function UsuarioForm({ usuario }: { usuario?: Usuario }) {
  const router = useRouter();
  const editando = !!usuario;

  const [form, setForm] = useState<Campos>(
    usuario ? { ...vazio, ...usuario, senha: "", confirmarSenha: "" } : vazio
  );
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  function set<K extends keyof Campos>(campo: K, valor: Campos[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  async function aoDigitarCep(valor: string) {
    const cep = maskCEP(valor);
    set("cep", cep);
    if (cep.length === 9) {
      setBuscandoCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`);
        const dados = await res.json();
        if (!dados.erro) {
          setForm((f) => ({
            ...f,
            logradouro: dados.logradouro || f.logradouro,
            bairro: dados.bairro || f.bairro,
            cidade: dados.localidade || f.cidade,
            uf: dados.uf || f.uf,
          }));
        } else {
          setErros((e) => ({ ...e, cep: "CEP não encontrado." }));
        }
      } catch {
        // sem internet: o usuário preenche o endereço manualmente
      } finally {
        setBuscandoCep(false);
      }
    }
  }

  function validar(): Erros {
    const e: Erros = {
      nome: validarNome(form.nome),
      email: validarEmail(form.email),
      cpf: validarCPF(form.cpf),
      telefone: validarTelefone(form.telefone),
      dataNascimento: validarData(form.dataNascimento),
      cep: validarCEP(form.cep),
      logradouro: form.logradouro.trim() ? "" : "Informe o logradouro.",
      numero: form.numero.trim() ? "" : "Informe o número.",
      bairro: form.bairro.trim() ? "" : "Informe o bairro.",
      cidade: form.cidade.trim() ? "" : "Informe a cidade.",
      uf: /^[A-Za-z]{2}$/.test(form.uf) ? "" : "UF inválida.",
      senha: validarSenha(form.senha, !editando),
      confirmarSenha: validarConfirmacao(form.senha, form.confirmarSenha),
    };
    // remove chaves sem erro
    (Object.keys(e) as (keyof Campos)[]).forEach((k) => !e[k] && delete e[k]);
    return e;
  }

  async function salvar(ev: React.FormEvent) {
    ev.preventDefault();
    setErroGeral("");
    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0) return;

    setSalvando(true);
    try {
      const [cpfExiste, emailExiste] = await Promise.all([
        valorJaExiste("cpf", form.cpf, usuario?.id),
        valorJaExiste("email", form.email.trim(), usuario?.id),
      ]);
      if (cpfExiste || emailExiste) {
        setErros({
          ...(cpfExiste && { cpf: "CPF já cadastrado." }),
          ...(emailExiste && { email: "E-mail já cadastrado." }),
        });
        return;
      }

      const { confirmarSenha: _ignorar, ...dados } = form;
      void _ignorar;
      const payload: UsuarioInput = {
        ...dados,
        nome: dados.nome.trim(),
        email: dados.email.trim(),
        uf: dados.uf.toUpperCase(),
        // na edição, senha em branco = manter a atual
        senha: dados.senha || usuario?.senha || "",
      };

      if (editando) await atualizarUsuario(usuario.id, payload);
      else await criarUsuario(payload);
      router.push("/usuarios");
    } catch {
      setErroGeral("Não foi possível salvar. Verifique se a API está rodando (npm run api).");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={salvar} noValidate className="space-y-6">
      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold">Dados pessoais</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Campo label="Nome completo" erro={erros.nome} className="md:col-span-2">
            <input
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Maria da Silva"
              className={inputCls(erros.nome)}
            />
          </Campo>
          <Campo label="E-mail" erro={erros.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="voce@email.com"
              className={inputCls(erros.email)}
            />
          </Campo>
          <Campo label="CPF" erro={erros.cpf}>
            <input
              value={form.cpf}
              onChange={(e) => set("cpf", maskCPF(e.target.value))}
              inputMode="numeric"
              placeholder="000.000.000-00"
              className={inputCls(erros.cpf)}
            />
          </Campo>
          <Campo label="Telefone" erro={erros.telefone}>
            <input
              value={form.telefone}
              onChange={(e) => set("telefone", maskTelefone(e.target.value))}
              inputMode="tel"
              placeholder="(00) 00000-0000"
              className={inputCls(erros.telefone)}
            />
          </Campo>
          <Campo label="Data de nascimento" erro={erros.dataNascimento}>
            <input
              value={form.dataNascimento}
              onChange={(e) => set("dataNascimento", maskData(e.target.value))}
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              className={inputCls(erros.dataNascimento)}
            />
          </Campo>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold">Endereço</h2>
        <div className="grid gap-4 md:grid-cols-6">
          <Campo label={buscandoCep ? "CEP (buscando...)" : "CEP"} erro={erros.cep} className="md:col-span-2">
            <input
              value={form.cep}
              onChange={(e) => aoDigitarCep(e.target.value)}
              inputMode="numeric"
              placeholder="00000-000"
              className={inputCls(erros.cep)}
            />
          </Campo>
          <Campo label="Logradouro" erro={erros.logradouro} className="md:col-span-3">
            <input
              value={form.logradouro}
              onChange={(e) => set("logradouro", e.target.value)}
              className={inputCls(erros.logradouro)}
            />
          </Campo>
          <Campo label="Número" erro={erros.numero} className="md:col-span-1">
            <input
              value={form.numero}
              onChange={(e) => set("numero", e.target.value)}
              className={inputCls(erros.numero)}
            />
          </Campo>
          <Campo label="Complemento" className="md:col-span-2">
            <input
              value={form.complemento}
              onChange={(e) => set("complemento", e.target.value)}
              className={inputCls()}
            />
          </Campo>
          <Campo label="Bairro" erro={erros.bairro} className="md:col-span-2">
            <input
              value={form.bairro}
              onChange={(e) => set("bairro", e.target.value)}
              className={inputCls(erros.bairro)}
            />
          </Campo>
          <Campo label="Cidade" erro={erros.cidade} className="md:col-span-1">
            <input
              value={form.cidade}
              onChange={(e) => set("cidade", e.target.value)}
              className={inputCls(erros.cidade)}
            />
          </Campo>
          <Campo label="UF" erro={erros.uf} className="md:col-span-1">
            <input
              value={form.uf}
              maxLength={2}
              onChange={(e) => set("uf", e.target.value.toUpperCase())}
              className={inputCls(erros.uf)}
            />
          </Campo>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-1 font-semibold">Senha</h2>
        {editando && (
          <p className="mb-4 text-xs text-slate-500">Deixe em branco para manter a senha atual.</p>
        )}
        <div className={`grid gap-4 md:grid-cols-2 ${editando ? "" : "mt-4"}`}>
          <Campo label="Senha" erro={erros.senha}>
            <input
              type="password"
              value={form.senha}
              onChange={(e) => set("senha", e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              className={inputCls(erros.senha)}
            />
          </Campo>
          <Campo label="Confirmar senha" erro={erros.confirmarSenha}>
            <input
              type="password"
              value={form.confirmarSenha}
              onChange={(e) => set("confirmarSenha", e.target.value)}
              autoComplete="new-password"
              className={inputCls(erros.confirmarSenha)}
            />
          </Campo>
        </div>
      </section>

      {erroGeral && <p className="text-sm text-red-600">{erroGeral}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar usuário"}
        </button>
        <Link
          href="/usuarios"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
