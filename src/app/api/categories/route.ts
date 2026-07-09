import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

function slugify(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const schema = z.object({ nome: z.string().min(1) });

export async function GET() {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });
  return NextResponse.json(categorias);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
  }

  const categoria = await prisma.categoria.create({
    data: { nome: parsed.data.nome, slug: slugify(parsed.data.nome) },
  });

  return NextResponse.json(categoria, { status: 201 });
}
