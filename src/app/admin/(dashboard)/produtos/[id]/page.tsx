import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: { id: string };
}) {
  const [produto, categorias] = await Promise.all([
    prisma.produto.findUnique({ where: { id: params.id } }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);

  if (!produto) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Editar produto</h1>
      <ProductForm
        categorias={categorias}
        produto={{
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          preco: Number(produto.preco),
          imagemUrl: produto.imagemUrl,
          categoriaId: produto.categoriaId,
          ativo: produto.ativo,
        }}
      />
    </div>
  );
}
