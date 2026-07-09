import Link from "next/link";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { VENDEDOR_COOKIE_NAME } from "@/lib/constants";
import { CatalogClient } from "@/components/CatalogClient";

type SearchParams = { [key: string]: string | string[] | undefined };

function readParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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

  const categoriaFiltro = readParam(searchParams, "category");
  const qFiltro = readParam(searchParams, "q");
  const sortFiltro = readParam(searchParams, "sort");
  const minPriceRaw = readParam(searchParams, "min_price");
  const maxPriceRaw = readParam(searchParams, "max_price");

  const minPrice = minPriceRaw !== undefined ? Number(minPriceRaw) : undefined;
  const maxPrice = maxPriceRaw !== undefined ? Number(maxPriceRaw) : undefined;

  const precoFiltro: Prisma.ProdutoWhereInput["preco"] =
    (minPrice !== undefined && !Number.isNaN(minPrice)) ||
    (maxPrice !== undefined && !Number.isNaN(maxPrice))
      ? {
          ...(minPrice !== undefined && !Number.isNaN(minPrice) ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined && !Number.isNaN(maxPrice) ? { lte: maxPrice } : {}),
        }
      : undefined;

  const orderBy: Prisma.ProdutoOrderByWithRelationInput =
    sortFiltro === "menor-preco"
      ? { preco: "asc" }
      : sortFiltro === "maior-preco"
        ? { preco: "desc" }
        : { createdAt: "desc" };

  const where: Prisma.ProdutoWhereInput = {
    ativo: true,
    ...(categoriaFiltro ? { categoria: { nome: categoriaFiltro } } : {}),
    ...(precoFiltro ? { preco: precoFiltro } : {}),
    ...(qFiltro
      ? {
          OR: [
            { nome: { contains: qFiltro, mode: "insensitive" } },
            { descricao: { contains: qFiltro, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [produtos, categoriasRaw] = await Promise.all([
    prisma.produto.findMany({
      where,
      include: { categoria: { select: { nome: true } } },
      orderBy,
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
