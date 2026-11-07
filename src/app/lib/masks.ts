// Máscaras e validações usadas no cadastro de usuários

const soDigitos = (v: string) => v.replace(/\D/g, "");

/* ---------- MÁSCARAS ---------- */

export function maskCPF(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskTelefone(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCEP(v: string): string {
  const d = soDigitos(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function maskData(v: string): string {
  const d = soDigitos(v).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/* ---------- VALIDAÇÕES (retornam "" se válido, ou a mensagem de erro) ---------- */

export function validarNome(v: string): string {
  const nome = v.trim();
  if (!nome) return "Informe o nome completo.";
  if (nome.split(/\s+/).length < 2) return "Informe nome e sobrenome.";
  return "";
}

export function validarEmail(v: string): string {
  if (!v.trim()) return "Informe o e-mail.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "E-mail inválido.";
  return "";
}

export function validarCPF(v: string): string {
  const d = soDigitos(v);
  if (!d) return "Informe o CPF.";
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return "CPF inválido.";
  const calc = (base: string, pesoInicial: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (pesoInicial - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = calc(d.slice(0, 9), 10);
  const d2 = calc(d.slice(0, 10), 11);
  if (d1 !== Number(d[9]) || d2 !== Number(d[10])) return "CPF inválido.";
  return "";
}

export function validarTelefone(v: string): string {
  const d = soDigitos(v);
  if (!d) return "Informe o telefone.";
  if (d.length < 10 || d.length > 11) return "Telefone inválido.";
  if (d.length === 11 && d[2] !== "9") return "Celular deve começar com 9.";
  return "";
}

export function validarCEP(v: string): string {
  const d = soDigitos(v);
  if (!d) return "Informe o CEP.";
  if (d.length !== 8) return "CEP inválido.";
  return "";
}

export function validarData(v: string): string {
  if (!v) return "Informe a data de nascimento.";
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "Use o formato dd/mm/aaaa.";
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const data = new Date(ano, mes - 1, dia);
  const real =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  if (!real) return "Data inexistente.";
  if (ano < 1900) return "Data inválida.";
  if (data > new Date()) return "A data não pode ser futura.";
  return "";
}

/** senha obrigatória no cadastro; na edição só é validada se for preenchida */
export function validarSenha(v: string, obrigatoria = true): string {
  if (!v) return obrigatoria ? "Informe a senha." : "";
  if (v.length < 6) return "A senha deve ter ao menos 6 caracteres.";
  return "";
}

export function validarConfirmacao(senha: string, confirmacao: string): string {
  if (senha && senha !== confirmacao) return "As senhas não conferem.";
  return "";
}
