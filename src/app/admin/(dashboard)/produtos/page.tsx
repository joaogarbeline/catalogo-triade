import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/whatsapp";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    include: { categoria: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-800">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600"
        >
          + Novo produto
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, i) => (
              <tr
                key={produto.id}
                className={i % 2 === 1 ? "bg-neutral-50" : "bg-white"}
              >
                <td className="px-4 py-3 font-medium text-neutral-800">{produto.nome}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {produto.categoria?.nome ?? "—"}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {formatCurrencyBRL(Number(produto.preco))}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      produto.ativo
                        ? "bg-primary-50 text-primary-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/produtos/${produto.id}`}
                      className="font-medium text-primary-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteButton endpoint={`/api/products/${produto.id}`} />
                  </div>
                </td>
              </tr>
            ))}
            {produtos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
