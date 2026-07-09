"use client";

import { useCart } from "@/hooks/useCart";

export function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalItens } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-end px-4 py-3">
        <button
          onClick={onOpenCart}
          aria-label="Abrir carrinho"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-50"
        >
          <CartIcon />
          {totalItens > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1 text-[11px] font-bold text-white">
              {totalItens}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
