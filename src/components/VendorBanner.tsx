export function VendorBanner({ nome }: { nome: string }) {
  return (
    <div className="bg-brand text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 text-sm">
        Você está comprando com <span className="font-semibold">{nome}</span>
      </div>
    </div>
  );
}
