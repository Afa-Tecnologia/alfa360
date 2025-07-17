
import VendasPage from "@/components/dashboard-v2/pages/VendasPage";
import { userService } from "@/lib/services/UserService";
import { ProductServiceEstoque } from "@/services/products/productEstoqueService";
import { Product } from '@/types/sales';
export default async function Page(){
  
  const productService = new ProductServiceEstoque();
  const [responseProducts, categories, sellers] =
    await Promise.all([
      productService.getProducts(),
      productService.getCategories(),
      userService.getVendedores()
    ])
  return (
    <VendasPage
      responseProducts={responseProducts}
      categories={categories}
      sellers={sellers}
    />
  );
};
