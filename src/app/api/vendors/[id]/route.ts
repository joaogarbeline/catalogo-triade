import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const vendedorSchema = z.object({
  nome: z.string().min(1),
  whatsapp: z
    .string()
    .min(10)
    .transform((v) => v.replace(/\D/g, "")),
  ativo: z.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const parsed = vendedorSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const vendedor = await prisma.vendedor.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json(vendedor);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.vendedor.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
