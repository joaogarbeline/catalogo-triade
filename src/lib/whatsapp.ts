export type CartItemForMessage = {
  nome: string;
  quantidade: number;
  preco: number;
};

export function formatCurrencyBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function buildOrderMessage(
  vendedorNome: string,
  itens: CartItemForMessage[]
) {
  const linhas = itens.map((item) => {
    const subtotal = item.preco * item.quantidade;
    return `${item.quantidade}x ${item.nome} (${formatCurrencyBRL(subtotal)})`;
  });

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const mensagem =
    `Olá ${vendedorNome}! Gostaria de fazer o seguinte pedido:\n` +
    `${linhas.join(" | ")}\n` +
    `Total: ${formatCurrencyBRL(total)}`;

  return mensagem;
}

export function buildWhatsAppLink(whatsappNumero: string, mensagem: string) {
  const numeroLimpo = whatsappNumero.replace(/\D/g, "");
  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
}
