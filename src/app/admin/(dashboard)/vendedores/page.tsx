import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/constants";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";

export const dynamic = "force-dynamic";

export default async function VendedoresPage() {
  const vendedores = await prisma.vendedor.findMany({ orderBy: { createdAt: "desc" } });
  const baseUrl = getBaseUrl();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Vendedores</h1>
        <Link
          href="/admin/vendedores/novo"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
        >
          + Novo vendedor
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Link do catálogo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vendedores.map((vendedor) => {
              const link = `${baseUrl}/c/${vendedor.hash}`;
              return (
                <tr key={vendedor.id}>
                  <td className="px-4 py-3 font-medium">{vendedor.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{vendedor.whatsapp}</td>
                  <td className="px-4 py-3">
                    <CopyLinkButton link={link} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        vendedor.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {vendedor.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/vendedores/${vendedor.id}`}
                        className="text-brand hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteButton endpoint={`/api/vendors/${vendedor.id}`} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {vendedores.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhum vendedor cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
