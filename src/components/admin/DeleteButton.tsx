"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ endpoint }: { endpoint: string }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    setCarregando(true);
    await fetch(endpoint, { method: "DELETE" });
    setCarregando(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={carregando}
      className="text-red-500 hover:underline disabled:opacity-50"
    >
      Excluir
    </button>
  );
}
