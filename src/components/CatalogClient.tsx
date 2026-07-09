"use client";

import { useMemo, useState } from "react";
import { CartProvider } from "@/hooks/useCart";
import { ProductCard, ProdutoCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { BottomCart } from "@/components/BottomCart";
import { CartDrawer } from "@/components/CartDrawer";
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
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const produtosFiltrados = useMemo(() => {
    if (!categoriaAtiva) return produtos;
    return produtos.filter((p) => p.categoria?.nome === categoriaAtiva);
  }, [produtos, categoriaAtiva]);

  return (
    <CartProvider
      vendedorHash={vendedorHash}
      vendedor={{ nome: vendedorNome, whatsapp: vendedorWhatsapp }}
    >
      <div className="min-h-screen bg-white pb-24">
        <Header onOpenCart={() => setCarrinhoAberto(true)} />
        <VendorBanner nome={vendedorNome} />

        <div className="mx-auto max-w-5xl px-4 py-6">
          {categorias.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                onClick={() => setCategoriaAtiva(null)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  categoriaAtiva === null
                    ? "bg-primary-500 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Todos
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaAtiva(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    categoriaAtiva === cat
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {produtosFiltrados.length === 0 ? (
            <p className="mt-12 text-center text-sm text-neutral-400">
              Nenhum produto disponível no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {produtosFiltrados.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomCart onOpenCart={() => setCarrinhoAberto(true)} />
      <CartDrawer open={carrinhoAberto} onClose={() => setCarrinhoAberto(false)} />
    </CartProvider>
  );
}
