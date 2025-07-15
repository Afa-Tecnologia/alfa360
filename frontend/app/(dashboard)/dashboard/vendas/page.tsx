
import VendasPage from "@/components/dashboard-v2/pages/VendasPage";
import { userService } from "@/lib/services/UserService";
import { ProductServiceEstoque } from "@/services/products/productEstoqueService";
import { Product } from '@/types/sales';
export default async function Page(){
  const productService = new ProductServiceEstoque();
  const fetchProducts = async () => {
    try {
      const products = await productService.getProducts();
      return products as any[];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };
  const fetchSellers = async () => {
    try {
      const response = await userService.getVendedores();
      return response;
    } catch (error) {
      console.error("Error fetching sellers:", error);
      return [];
    }
  };

  const products = await fetchProducts();
  const categories = await fetchCategories();
  const sellers = await fetchSellers();
  return (
    <VendasPage
      products={products}
      categories={categories}
      sellers={sellers}
    />
  );
};
