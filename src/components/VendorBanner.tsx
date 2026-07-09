export function VendorBanner({ nome }: { nome: string }) {
  return (
    <div className="border-b border-primary-100 bg-primary-50">
      <div className="mx-auto max-w-5xl px-4 py-2.5 text-sm text-primary-800">
        Você está comprando com <span className="font-semibold">{nome}</span>
      </div>
    </div>
  );
}
