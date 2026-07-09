"use client";

import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatCurrencyBRL } from "@/lib/whatsapp";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { itens, totalPreco, removerItem, alterarQuantidade, finalizarPedido } = useCart();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 p-4">
          <h2 className="text-lg font-bold text-neutral-800">Seu carrinho</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {itens.length === 0 ? (
            <p className="mt-8 text-center text-sm text-neutral-400">
              Seu carrinho está vazio.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {itens.map((item) => (
                <li key={item.produtoId} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
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
                    <span className="text-sm font-medium leading-tight text-neutral-800">
                      {item.nome}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatCurrencyBRL(item.preco)}
                    </span>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        onClick={() => alterarQuantidade(item.produtoId, item.quantidade - 1)}
                        className="h-6 w-6 rounded-md border border-neutral-200 text-sm leading-none text-neutral-600 hover:bg-neutral-50"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm text-neutral-800">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => alterarQuantidade(item.produtoId, item.quantidade + 1)}
                        className="h-6 w-6 rounded-md border border-neutral-200 text-sm leading-none text-neutral-600 hover:bg-neutral-50"
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

        <div className="border-t border-neutral-100 p-4">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold text-neutral-800">
            <span>Total</span>
            <span>{formatCurrencyBRL(totalPreco)}</span>
          </div>
          <button
            disabled={itens.length === 0}
            onClick={finalizarPedido}
            className="w-full rounded-lg bg-whatsapp py-3 text-sm font-semibold text-white transition hover:bg-whatsapp-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Finalizar pedido no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
