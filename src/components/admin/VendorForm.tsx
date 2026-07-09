"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type VendedorInicial = {
  id: string;
  nome: string;
  whatsapp: string;
  ativo: boolean;
};

export function VendorForm({ vendedor }: { vendedor?: VendedorInicial }) {
  const router = useRouter();
  const isEdicao = Boolean(vendedor);

  const [nome, setNome] = useState(vendedor?.nome ?? "");
  const [whatsapp, setWhatsapp] = useState(vendedor?.whatsapp ?? "");
  const [ativo, setAtivo] = useState(vendedor?.ativo ?? true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const res = await fetch(
      isEdicao ? `/api/vendors/${vendedor!.id}` : "/api/vendors",
      {
        method: isEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, whatsapp, ativo }),
      }
    );

    setEnviando(false);

    if (!res.ok) {
      setErro("Não foi possível salvar o vendedor. Verifique os campos.");
      return;
    }

    router.push("/admin/vendedores");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Nome</label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          WhatsApp (com DDI e DDD, ex: 5511999999999)
        </label>
        <input
          required
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="5511999999999"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
        Vendedor ativo (link funcional)
      </label>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-lg bg-primary-500 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {enviando ? "Salvando..." : "Salvar vendedor"}
      </button>
    </form>
  );
}
