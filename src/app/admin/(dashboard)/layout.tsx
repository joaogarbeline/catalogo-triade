import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-neutral-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <nav className="flex items-center gap-3 text-sm font-medium sm:gap-5">
            <Link href="/admin" className="text-white transition hover:text-primary-300">
              Dashboard
            </Link>
            <Link
              href="/admin/produtos"
              className="text-neutral-300 transition hover:text-primary-300"
            >
              Produtos
            </Link>
            <Link
              href="/admin/vendedores"
              className="text-neutral-300 transition hover:text-primary-300"
            >
              Vendedores
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
