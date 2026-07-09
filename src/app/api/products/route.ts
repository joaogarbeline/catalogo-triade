import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const produtoSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().min(1),
  preco: z.number().positive(),
  imagemUrl: z.string().min(1).nullable().optional(),
  categoriaId: z.string().nullable().optional(),
  ativo: z.boolean().optional(),
});

export async function GET() {
  const produtos = await prisma.produto.findMany({
    include: { categoria: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(produtos);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = produtoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const produto = await prisma.produto.create({ data: parsed.data });
  return NextResponse.json(produto, { status: 201 });
}
