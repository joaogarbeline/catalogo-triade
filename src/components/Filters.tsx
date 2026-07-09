"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

type SortOption = "recentes" | "menor-preco" | "maior-preco";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recentes", label: "Mais Recentes" },
  { value: "menor-preco", label: "Menor Preço" },
  { value: "maior-preco", label: "Maior Preço" },
];

const NUMERIC_INPUT_PATTERN = /^\d*\.?\d*$/;

export function Filters({ categorias }: { categorias: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoriaAtual = searchParams.get("category") ?? "";
  const sortAtual = (searchParams.get("sort") as SortOption | null) || "recentes";

  const [minPriceInput, setMinPriceInput] = useState(searchParams.get("min_price") ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get("max_price") ?? "");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [sheetAberto, setSheetAberto] = useState(false);

  const minPriceDebounced = useDebounce(minPriceInput, 300);
  const maxPriceDebounced = useDebounce(maxPriceInput, 300);
  const searchDebounced = useDebounce(searchInput, 300);

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    if (minPriceDebounced !== (searchParams.get("min_price") ?? "")) {
      updateParams({ min_price: minPriceDebounced || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPriceDebounced]);

  useEffect(() => {
    if (maxPriceDebounced !== (searchParams.get("max_price") ?? "")) {
      updateParams({ max_price: maxPriceDebounced || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPriceDebounced]);

  useEffect(() => {
    if (searchDebounced !== (searchParams.get("q") ?? "")) {
      updateParams({ q: searchDebounced || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounced]);

  const filtrosAtivos = useMemo(() => {
    let count = 0;
    if (categoriaAtual) count++;
    if (searchParams.get("min_price")) count++;
    if (searchParams.get("max_price")) count++;
    if (searchParams.get("q")) count++;
    if (sortAtual !== "recentes") count++;
    return count;
  }, [categoriaAtual, sortAtual, searchParams]);

  function limparFiltros() {
    setMinPriceInput("");
    setMaxPriceInput("");
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  }

  function handleNumericInput(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const valor = e.target.value;
      if (valor === "" || NUMERIC_INPUT_PATTERN.test(valor)) {
        setter(valor);
      }
    };
  }

  const conteudoFiltros = (
    <div className="flex flex-col gap-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-neutral-800">Buscar</label>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Nome do produto..."
          className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-800 outline-none transition-colors duration-150 focus:border-primary-500 focus:bg-white"
        />
      </div>

      {categorias.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-800">Categorias</label>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
            <button
              onClick={() => updateParams({ category: null })}
              className={`min-h-[48px] shrink-0 whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors duration-150 active:scale-95 ${
                categoriaAtual === ""
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParams({ category: categoriaAtual === cat ? null : cat })}
                className={`min-h-[48px] shrink-0 whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors duration-150 active:scale-95 ${
                  categoriaAtual === cat
                    ? "bg-primary-500 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-neutral-800">Faixa de preço</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={minPriceInput}
            onChange={handleNumericInput(setMinPriceInput)}
            placeholder="Mín."
            className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-800 outline-none transition-colors duration-150 focus:border-primary-500 focus:bg-white"
          />
          <span className="text-neutral-400">—</span>
          <input
            type="text"
            inputMode="decimal"
            value={maxPriceInput}
            onChange={handleNumericInput(setMaxPriceInput)}
            placeholder="Máx."
            className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-800 outline-none transition-colors duration-150 focus:border-primary-500 focus:bg-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-neutral-800">Ordenar por</label>
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParams({ sort: opt.value === "recentes" ? null : opt.value })}
              className={`flex h-12 items-center justify-between rounded-lg border px-3 text-sm font-medium transition-colors duration-150 active:scale-[0.98] ${
                sortAtual === opt.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {opt.label}
              {sortAtual === opt.value && <CheckIcon />}
            </button>
          ))}
        </div>
      </div>

      {filtrosAtivos > 0 && (
        <button
          onClick={limparFiltros}
          className="h-12 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-600 transition-colors duration-150 hover:bg-neutral-50 active:scale-[0.98]"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20">{conteudoFiltros}</div>
      </aside>

      <button
        onClick={() => setSheetAberto(true)}
        aria-label="Abrir filtros"
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform duration-150 active:scale-95 lg:hidden"
      >
        <FilterIcon />
        {filtrosAtivos > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-primary-600 ring-2 ring-primary-500">
            {filtrosAtivos}
          </span>
        )}
      </button>

      <div
        className={`fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out lg:hidden ${
          sheetAberto ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSheetAberto(false)}
      >
        <div
          className={`fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl transition-transform duration-300 ease-in-out ${
            sheetAberto ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-800">Filtros</h2>
            <button
              onClick={() => setSheetAberto(false)}
              aria-label="Fechar filtros"
              className="flex h-12 w-12 items-center justify-center rounded-full text-neutral-400 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-700"
            >
              ✕
            </button>
          </div>
          {conteudoFiltros}
          <button
            onClick={() => setSheetAberto(false)}
            className="mt-6 h-12 w-full rounded-lg bg-primary-500 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  );
}

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
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
      className="h-4 w-4"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
