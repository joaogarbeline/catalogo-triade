import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { VENDEDOR_COOKIE_NAME } from "@/lib/constants";
import { CatalogClient } from "@/components/CatalogClient";

export default async function HomePage() {
  const vendedorHash = cookies().get(VENDEDOR_COOKIE_NAME)?.value;

  const vendedor = vendedorHash
    ? await prisma.vendedor.findUnique({ where: { hash: vendedorHash } })
    : null;

  if (!vendedor || !vendedor.ativo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-800">Performance Tríade</h1>
        <p className="max-w-md text-neutral-500">
          Este catálogo é acessado através de um link exclusivo de vendedor.
          Solicite o seu link para começar a comprar.
        </p>
        <Link
          href="/admin/login"
          className="mt-6 text-sm text-neutral-400 underline underline-offset-4"
        >
          Acesso administrativo
        </Link>
      </main>
    );
  }

  const [produtos, categoriasRaw] = await Promise.all([
    prisma.produto.findMany({
      where: { ativo: true },
      include: { categoria: { select: { nome: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <CatalogClient
      vendedorHash={vendedor.hash}
      vendedorNome={vendedor.nome}
      vendedorWhatsapp={vendedor.whatsapp}
      produtos={produtos.map((p) => ({
        id: p.id,
        nome: p.nome,
        descricao: p.descricao,
        preco: Number(p.preco),
        imagemUrl: p.imagemUrl,
        categoria: p.categoria,
      }))}
      categorias={categoriasRaw.map((c) => c.nome)}
    />
  );
}
