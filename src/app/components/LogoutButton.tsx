"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="mt-auto rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800"
    >
      ⎋ Sair
    </button>
  );
}
