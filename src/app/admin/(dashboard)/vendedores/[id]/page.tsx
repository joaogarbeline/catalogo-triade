import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VendorForm } from "@/components/admin/VendorForm";

export const dynamic = "force-dynamic";

export default async function EditarVendedorPage({
  params,
}: {
  params: { id: string };
}) {
  const vendedor = await prisma.vendedor.findUnique({ where: { id: params.id } });

  if (!vendedor) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Editar vendedor</h1>
      <VendorForm
        vendedor={{
          id: vendedor.id,
          nome: vendedor.nome,
          whatsapp: vendedor.whatsapp,
          ativo: vendedor.ativo,
        }}
      />
    </div>
  );
}
