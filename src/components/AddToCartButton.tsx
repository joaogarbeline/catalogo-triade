"use client";

import { useRef, useState } from "react";

export function AddToCartButton({ onAdd }: { onAdd: () => void }) {
  const [adicionado, setAdicionado] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    onAdd();
    setAdicionado(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdicionado(false), 1000);
  }

  return (
    <button
      onClick={handleClick}
      className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all duration-250 ease-out active:scale-95 ${
        adicionado ? "bg-primary-700" : "bg-primary-500 hover:bg-primary-600"
      }`}
    >
      {adicionado ? (
        <span className="flex items-center gap-1">
          <CheckIcon />
          Adicionado!
        </span>
      ) : (
        "+ Adicionar"
      )}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
