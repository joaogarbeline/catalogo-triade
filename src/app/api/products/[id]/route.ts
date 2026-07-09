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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const produto = await prisma.produto.findUnique({
    where: { id: params.id },
    include: { categoria: true },
  });
  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  return NextResponse.json(produto);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const parsed = produtoSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const produto = await prisma.produto.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json(produto);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.produto.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
