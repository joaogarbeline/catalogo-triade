"use client";

import { useMemo, useState } from "react";
import { CartProvider } from "@/hooks/useCart";
import { ProductCard, ProdutoCard } from "@/components/ProductCard";
import { CartButton } from "@/components/CartDrawer";
import { VendorBanner } from "@/components/VendorBanner";

type Props = {
  vendedorHash: string;
  vendedorNome: string;
  vendedorWhatsapp: string;
  produtos: ProdutoCard[];
  categorias: string[];
};

export function CatalogClient({
  vendedorHash,
  vendedorNome,
  vendedorWhatsapp,
  produtos,
  categorias,
}: Props) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const produtosFiltrados = useMemo(() => {
    if (!categoriaAtiva) return produtos;
    return produtos.filter((p) => p.categoria?.nome === categoriaAtiva);
  }, [produtos, categoriaAtiva]);

  return (
    <CartProvider
      vendedorHash={vendedorHash}
      vendedor={{ nome: vendedorNome, whatsapp: vendedorWhatsapp }}
    >
      <VendorBanner nome={vendedorNome} />

      <div className="mx-auto max-w-5xl px-4 py-6">
        {categorias.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaAtiva(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                categoriaAtiva === null
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  categoriaAtiva === cat
                    ? "bg-brand text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {produtosFiltrados.length === 0 ? (
          <p className="mt-12 text-center text-sm text-gray-400">
            Nenhum produto disponível no momento.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-24 sm:grid-cols-3 lg:grid-cols-4">
            {produtosFiltrados.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>

      <CartButton />
    </CartProvider>
  );
}
