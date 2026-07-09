"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatCurrencyBRL } from "@/lib/whatsapp";

export function CartButton() {
  const [aberto, setAberto] = useState(false);
  const { totalItens } = useCart();

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-whatsapp-dark"
      >
        🛒 Carrinho
        {totalItens > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-whatsapp-dark">
            {totalItens}
          </span>
        )}
      </button>
      {aberto && <CartDrawer onClose={() => setAberto(false)} />}
    </>
  );
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const { itens, totalPreco, removerItem, alterarQuantidade, finalizarPedido } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Seu carrinho</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {itens.length === 0 ? (
            <p className="mt-8 text-center text-sm text-gray-400">
              Seu carrinho está vazio.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {itens.map((item) => (
                <li key={item.produtoId} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {item.imagemUrl && (
                      <Image
                        src={item.imagemUrl}
                        alt={item.nome}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium leading-tight">{item.nome}</span>
                    <span className="text-xs text-gray-500">
                      {formatCurrencyBRL(item.preco)}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => alterarQuantidade(item.produtoId, item.quantidade - 1)}
                        className="h-6 w-6 rounded border text-sm leading-none hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm">{item.quantidade}</span>
                      <button
                        onClick={() => alterarQuantidade(item.produtoId, item.quantidade + 1)}
                        className="h-6 w-6 rounded border text-sm leading-none hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removerItem(item.produtoId)}
                        className="ml-auto text-xs text-red-500 hover:underline"
                      >
                        remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t p-4">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span>{formatCurrencyBRL(totalPreco)}</span>
          </div>
          <button
            disabled={itens.length === 0}
            onClick={finalizarPedido}
            className="w-full rounded-md bg-whatsapp py-3 text-sm font-semibold text-white transition hover:bg-whatsapp-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Finalizar pedido no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
