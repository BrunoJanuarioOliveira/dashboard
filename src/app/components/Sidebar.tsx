import Link from "next/link";
import LogoutButton from "./LogoutButton";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/produtos", label: "Produtos", icon: "▤" },
  { href: "/usuarios", label: "Usuários", icon: "☺" },
];

export default function Sidebar({ active }: { active: string }) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-slate-900 text-slate-200 p-5">
      <div className="text-xl font-bold text-white mb-8">
        <span className="text-indigo-400">●</span> DashPC
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              active === l.href
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            <span className="mr-2">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
      <LogoutButton />
    </aside>
  );
}
