export default function Footer({ claro = false }: { claro?: boolean }) {
  const cor = claro ? "text-white/80 border-white/20" : "text-slate-500 border-slate-200";
  return (
    <footer className={`mt-auto border-t pt-4 text-center text-xs ${cor}`}>
      <p>© 2026 DashPC. Todos os direitos reservados.</p>
      <p className="mt-1">
        Desenvolvido por Lucas Dantas, Bruno Januario e Wagner Junior
      </p>
    </footer>
  );
}
