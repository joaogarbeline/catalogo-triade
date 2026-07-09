"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
  const fotoInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErro(null);
    setEnviandoImagem(true);
    const formData = new FormData();
    formData.append("file", file);

    let res: Response;
    try {
      res = await fetch("/api/upload", { method: "POST", body: formData });
    } catch {
      setEnviandoImagem(false);
      setErro("Falha ao enviar imagem: sem conexão com o servidor.");
      return;
    }

    setEnviandoImagem(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErro(`Falha ao enviar imagem: ${data?.error ?? `erro ${res.status}`}`);
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
        <label className="mb-1 block text-sm font-medium text-neutral-700">Nome</label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Descrição</label>
        <textarea
          required
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Preço (R$)</label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Categoria</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="mb-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
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
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs outline-none focus:border-primary-500"
          />
          <button
            type="button"
            onClick={handleCriarCategoria}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Foto</label>
        <input
          id="foto-produto"
          ref={fotoInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        {imagemUrl ? (
          <div className="flex items-center gap-3">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-neutral-200">
              <Image src={imagemUrl} alt="Preview" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="foto-produto"
                className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 px-4 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 active:scale-[0.98]"
              >
                Trocar foto
              </label>
              <button
                type="button"
                onClick={() => {
                  setImagemUrl(null);
                  if (fotoInputRef.current) fotoInputRef.current.value = "";
                }}
                className="flex h-11 items-center justify-center rounded-lg border border-red-100 px-4 text-xs font-medium text-red-500 transition hover:bg-red-50 active:scale-[0.98]"
              >
                Remover foto
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="foto-produto"
            className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-200 text-neutral-500 transition hover:border-primary-300 hover:bg-primary-50/40 active:scale-[0.99]"
          >
            <CameraIcon />
            <span className="text-xs font-medium">Tirar foto ou escolher da galeria</span>
          </label>
        )}

        {enviandoImagem && <p className="mt-2 text-xs text-neutral-400">Enviando imagem...</p>}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
        Produto ativo (visível no catálogo)
      </label>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-lg bg-primary-500 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {enviando ? "Salvando..." : "Salvar produto"}
      </button>
    </form>
  );
}

function CameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
