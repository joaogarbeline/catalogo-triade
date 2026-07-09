import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalProdutos, totalVendedores] = await Promise.all([
    prisma.produto.count(),
    prisma.vendedor.count(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/produtos"
          className="rounded-lg border bg-white p-5 shadow-sm hover:border-brand"
        >
          <p className="text-sm text-gray-500">Produtos cadastrados</p>
          <p className="mt-1 text-3xl font-bold text-brand">{totalProdutos}</p>
        </Link>
        <Link
          href="/admin/vendedores"
          className="rounded-lg border bg-white p-5 shadow-sm hover:border-brand"
        >
          <p className="text-sm text-gray-500">Vendedores ativos</p>
          <p className="mt-1 text-3xl font-bold text-brand">{totalVendedores}</p>
        </Link>
      </div>
    </div>
  );
}
