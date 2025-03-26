import ProductList from "@/components/estoquenovo/ProductListing";
import ProductListingInTable from "@/components/estoquenovo/ProductListingInTable";

export default function Page() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Produtos</h1>
      <ProductListingInTable />
    </main>
  );
}
