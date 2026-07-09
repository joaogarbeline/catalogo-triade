import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de arquivo não suportado" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Arquivo maior que 5MB" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extensao = file.type.split("/")[1];
  const nomeArquivo = `${randomUUID()}.${extensao}`;

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, nomeArquivo), bytes);
  } catch (err) {
    console.error("Falha ao salvar imagem em disco:", err);
    return NextResponse.json(
      { error: "Não foi possível salvar o arquivo no servidor" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: `/uploads/${nomeArquivo}` }, { status: 201 });
}
