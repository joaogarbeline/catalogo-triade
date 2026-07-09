"use client";

import { Suspense, useState } from "react";
import { CartProvider } from "@/hooks/useCart";
import { ProductCard, ProdutoCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { BottomCart } from "@/components/BottomCart";
import { CartDrawer } from "@/components/CartDrawer";
import { VendorBanner } from "@/components/VendorBanner";
import { Filters } from "@/components/Filters";
import { EmptyState } from "@/components/EmptyState";

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
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  return (
    <CartProvider
      vendedorHash={vendedorHash}
      vendedor={{ nome: vendedorNome, whatsapp: vendedorWhatsapp }}
    >
      <div className="min-h-screen bg-white pb-24">
        <Header onOpenCart={() => setCarrinhoAberto(true)} />
        <VendorBanner nome={vendedorNome} />

        <div className="mx-auto flex max-w-5xl gap-6 px-4 py-6">
          <Suspense fallback={null}>
            <Filters categorias={categorias} />
          </Suspense>

          <div className="min-w-0 flex-1">
            {produtos.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {produtos.map((produto) => (
                  <ProductCard key={produto.id} produto={produto} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomCart onOpenCart={() => setCarrinhoAberto(true)} />
      <CartDrawer open={carrinhoAberto} onClose={() => setCarrinhoAberto(false)} />
    </CartProvider>
  );
}
