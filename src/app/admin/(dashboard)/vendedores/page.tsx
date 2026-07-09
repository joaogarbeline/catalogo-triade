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
        <h1 className="text-xl font-bold text-neutral-800">Vendedores</h1>
        <Link
          href="/admin/vendedores/novo"
          className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600"
        >
          + Novo vendedor
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Link do catálogo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((vendedor, i) => {
              const link = `${baseUrl}/c/${vendedor.hash}`;
              return (
                <tr
                  key={vendedor.id}
                  className={i % 2 === 1 ? "bg-neutral-50" : "bg-white"}
                >
                  <td className="px-4 py-3 font-medium text-neutral-800">{vendedor.nome}</td>
                  <td className="px-4 py-3 text-neutral-500">{vendedor.whatsapp}</td>
                  <td className="px-4 py-3">
                    <CopyLinkButton link={link} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        vendedor.ativo
                          ? "bg-primary-50 text-primary-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {vendedor.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/vendedores/${vendedor.id}`}
                        className="font-medium text-primary-600 hover:underline"
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
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
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
