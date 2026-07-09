"use client";

import { usePathname, useRouter } from "next/navigation";

export function EmptyState() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <div>
        <p className="text-base font-semibold text-neutral-800">Nenhum produto encontrado</p>
        <p className="mt-1 text-sm text-neutral-500">
          Tente ajustar os filtros ou buscar por outro termo.
        </p>
      </div>
      <button
        onClick={() => router.replace(pathname, { scroll: false })}
        className="h-12 rounded-lg bg-primary-500 px-6 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
      >
        Limpar Filtros
      </button>
    </div>
  );
}
