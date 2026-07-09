import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

const vendedorSchema = z.object({
  nome: z.string().min(1),
  whatsapp: z
    .string()
    .min(10)
    .transform((v) => v.replace(/\D/g, "")),
  ativo: z.boolean().optional(),
});

export async function GET() {
  const vendedores = await prisma.vendedor.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(vendedores);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = vendedorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const vendedor = await prisma.vendedor.create({
    data: {
      ...parsed.data,
      hash: nanoid(10),
    },
  });

  return NextResponse.json(vendedor, { status: 201 });
}
