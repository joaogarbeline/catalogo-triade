import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Novo produto</h1>
      <ProductForm categorias={categorias} />
    </div>
  );
}
