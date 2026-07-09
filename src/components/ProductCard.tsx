"use client";

import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatCurrencyBRL } from "@/lib/whatsapp";

export type ProdutoCard = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string | null;
  categoria: { nome: string } | null;
};

export function ProductCard({ produto }: { produto: ProdutoCard }) {
  const { adicionarItem } = useCart();

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-square w-full bg-gray-100">
        {produto.imagemUrl ? (
          <Image
            src={produto.imagemUrl}
            alt={produto.nome}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            Sem imagem
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {produto.categoria && (
          <span className="text-[11px] uppercase tracking-wide text-gray-400">
            {produto.categoria.nome}
          </span>
        )}
        <h3 className="text-sm font-semibold leading-snug">{produto.nome}</h3>
        <p className="line-clamp-2 flex-1 text-xs text-gray-500">{produto.descricao}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-brand">{formatCurrencyBRL(produto.preco)}</span>
          <button
            onClick={() =>
              adicionarItem({
                produtoId: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagemUrl: produto.imagemUrl,
              })
            }
            className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-light"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
