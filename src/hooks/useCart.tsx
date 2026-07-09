"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { buildOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export type CartItem = {
  produtoId: string;
  nome: string;
  preco: number;
  imagemUrl: string | null;
  quantidade: number;
};

type VendedorInfo = {
  nome: string;
  whatsapp: string;
};

type CartContextValue = {
  itens: CartItem[];
  totalItens: number;
  totalPreco: number;
  adicionarItem: (produto: Omit<CartItem, "quantidade">, quantidade?: number) => void;
  removerItem: (produtoId: string) => void;
  alterarQuantidade: (produtoId: string, quantidade: number) => void;
  limparCarrinho: () => void;
  finalizarPedido: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(vendedorHash: string) {
  return `carrinho:${vendedorHash}`;
}

export function CartProvider({
  children,
  vendedorHash,
  vendedor,
}: {
  children: ReactNode;
  vendedorHash: string;
  vendedor: VendedorInfo;
}) {
  const [itens, setItens] = useState<CartItem[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(vendedorHash));
      if (raw) {
        setItens(JSON.parse(raw));
      }
    } catch {
      // localStorage indisponível ou dado corrompido: ignora e começa vazio
    } finally {
      setCarregado(true);
    }
  }, [vendedorHash]);

  useEffect(() => {
    if (!carregado) return;
    window.localStorage.setItem(storageKey(vendedorHash), JSON.stringify(itens));
  }, [itens, vendedorHash, carregado]);

  const adicionarItem = useCallback(
    (produto: Omit<CartItem, "quantidade">, quantidade = 1) => {
      setItens((atual) => {
        const existente = atual.find((item) => item.produtoId === produto.produtoId);
        if (existente) {
          return atual.map((item) =>
            item.produtoId === produto.produtoId
              ? { ...item, quantidade: item.quantidade + quantidade }
              : item
          );
        }
        return [...atual, { ...produto, quantidade }];
      });
    },
    []
  );

  const removerItem = useCallback((produtoId: string) => {
    setItens((atual) => atual.filter((item) => item.produtoId !== produtoId));
  }, []);

  const alterarQuantidade = useCallback((produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      setItens((atual) => atual.filter((item) => item.produtoId !== produtoId));
      return;
    }
    setItens((atual) =>
      atual.map((item) =>
        item.produtoId === produtoId ? { ...item, quantidade } : item
      )
    );
  }, []);

  const limparCarrinho = useCallback(() => {
    setItens([]);
  }, []);

  const totalItens = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade, 0),
    [itens]
  );

  const totalPreco = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade * item.preco, 0),
    [itens]
  );

  const finalizarPedido = useCallback(() => {
    if (itens.length === 0) return;
    const mensagem = buildOrderMessage(
      vendedor.nome,
      itens.map((item) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
      }))
    );
    const link = buildWhatsAppLink(vendedor.whatsapp, mensagem);
    window.open(link, "_blank", "noopener,noreferrer");
  }, [itens, vendedor]);

  const value: CartContextValue = {
    itens,
    totalItens,
    totalPreco,
    adicionarItem,
    removerItem,
    alterarQuantidade,
    limparCarrinho,
    finalizarPedido,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart precisa ser usado dentro de um CartProvider");
  }
  return ctx;
}
