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
      <h1 className="text-xl font-bold text-neutral-800">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/produtos"
          className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md"
        >
          <p className="text-sm text-neutral-500">Produtos cadastrados</p>
          <p className="mt-1 text-3xl font-bold text-primary-600">{totalProdutos}</p>
        </Link>
        <Link
          href="/admin/vendedores"
          className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md"
        >
          <p className="text-sm text-neutral-500">Vendedores ativos</p>
          <p className="mt-1 text-3xl font-bold text-primary-600">{totalVendedores}</p>
        </Link>
      </div>
    </div>
  );
}
