import { VendorForm } from "@/components/admin/VendorForm";

export const dynamic = "force-dynamic";

export default function NovoVendedorPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Novo vendedor</h1>
      <VendorForm />
    </div>
  );
}
