"use client";

import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copiado, setCopiado] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      title={link}
      className="max-w-[220px] truncate text-xs text-primary-600 hover:underline"
    >
      {copiado ? "Link copiado!" : link}
    </button>
  );
}
