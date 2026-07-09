"use client";

import { useState } from "react";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
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
  const [imagemCarregada, setImagemCarregada] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
        {produto.imagemUrl ? (
          <Image
            src={produto.imagemUrl}
            alt={produto.nome}
            fill
            className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              imagemCarregada ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md"
            }`}
            sizes="(max-width: 768px) 50vw, 25vw"
            onLoad={() => setImagemCarregada(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            Sem imagem
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {produto.categoria && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            {produto.categoria.nome}
          </span>
        )}
        <h3 className="text-sm font-semibold leading-snug text-neutral-800">
          {produto.nome}
        </h3>
        <p className="line-clamp-2 flex-1 text-xs text-neutral-500">
          {produto.descricao}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-primary-600">
            {formatCurrencyBRL(produto.preco)}
          </span>
          <AddToCartButton
            onAdd={() =>
              adicionarItem({
                produtoId: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagemUrl: produto.imagemUrl,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
