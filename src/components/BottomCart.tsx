"use client";

import { useCart } from "@/hooks/useCart";
import { formatCurrencyBRL } from "@/lib/whatsapp";

export function BottomCart({ onOpenCart }: { onOpenCart: () => void }) {
  const { itens, totalItens, totalPreco, finalizarPedido } = useCart();

  if (itens.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-100 bg-white shadow-[0_-4px_16px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <button
          onClick={onOpenCart}
          className="flex flex-1 flex-col items-start text-left"
        >
          <span className="text-xs text-neutral-500">
            {totalItens} {totalItens === 1 ? "item" : "itens"} · toque para ver
          </span>
          <span className="text-base font-bold text-neutral-800">
            Total: {formatCurrencyBRL(totalPreco)}
          </span>
        </button>
        <button
          onClick={finalizarPedido}
          className="shrink-0 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:bg-whatsapp-dark active:scale-95"
        >
          Fechar Pedido
        </button>
      </div>
    </div>
  );
}
