"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

type Categoria = { id: string; nome: string };

type ProdutoInicial = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string | null;
  categoriaId: string | null;
  ativo: boolean;
};

export function ProductForm({
  categorias,
  produto,
}: {
  categorias: Categoria[];
  produto?: ProdutoInicial;
}) {
  const router = useRouter();
  const isEdicao = Boolean(produto);

  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(produto ? String(produto.preco) : "");
  const [categoriaId, setCategoriaId] = useState(produto?.categoriaId ?? "");
  const [imagemUrl, setImagemUrl] = useState<string | null>(produto?.imagemUrl ?? null);
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setEnviandoImagem(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setEnviandoImagem(false);

    if (!res.ok) {
      setErro("Falha ao enviar imagem");
      return;
    }

    const data = await res.json();
    setImagemUrl(data.url);
  }

  async function handleCriarCategoria() {
    if (!novaCategoria.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novaCategoria.trim() }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategoriaId(cat.id);
      setNovaCategoria("");
      router.refresh();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const payload = {
      nome,
      descricao,
      preco: Number(preco),
      categoriaId: categoriaId || null,
      imagemUrl: imagemUrl || null,
      ativo,
    };

    const res = await fetch(
      isEdicao ? `/api/products/${produto!.id}` : "/api/products",
      {
        method: isEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setEnviando(false);

    if (!res.ok) {
      setErro("Não foi possível salvar o produto. Verifique os campos.");
      return;
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          required
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Preço (R$)</label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="mb-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="">Sem categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            placeholder="Nova categoria"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            className="flex-1 rounded-md border px-3 py-1.5 text-xs outline-none focus:border-brand"
          />
          <button
            type="button"
            onClick={handleCriarCategoria}
            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Foto</label>
        <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
        {enviandoImagem && <p className="mt-1 text-xs text-gray-400">Enviando imagem...</p>}
        {imagemUrl && (
          <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-md border">
            <Image src={imagemUrl} alt="Preview" fill className="object-cover" />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
        Produto ativo (visível no catálogo)
      </label>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-md bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-light disabled:opacity-50"
      >
        {enviando ? "Salvando..." : "Salvar produto"}
      </button>
    </form>
  );
}
