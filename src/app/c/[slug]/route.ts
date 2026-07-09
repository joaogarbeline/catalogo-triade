import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VENDEDOR_COOKIE_NAME, VENDEDOR_COOKIE_MAX_AGE, getBaseUrl } from "@/lib/constants";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const vendedor = await prisma.vendedor.findUnique({
    where: { hash: params.slug },
  });

  const redirectUrl = new URL("/", getBaseUrl());

  if (!vendedor || !vendedor.ativo) {
    redirectUrl.searchParams.set("vendedor_invalido", "1");
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(VENDEDOR_COOKIE_NAME, vendedor.hash, {
    maxAge: VENDEDOR_COOKIE_MAX_AGE,
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}
