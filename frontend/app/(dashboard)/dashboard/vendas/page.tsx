import VendasPage from '@/components/dashboard-v2/pages/VendasPage';
import { userService } from '@/lib/services/UserService';
import { ProductServiceEstoque } from '@/services/products/productEstoqueService';
import { Product } from '@/types/sales';
import { normalizeProduct } from '@/utils/normalizeProduct';
import { ResponseProductsToSalesComponent } from '@/types/product';

// Force dynamic rendering to prevent build-time API calls
export const dynamic = 'force-dynamic';

export default async function Page() {
  const productService = new ProductServiceEstoque();

  try {
    const [responseProducts, categories, sellers] = await Promise.all([
      productService.getProducts(),
      productService.getCategories(),
      productService.getVendedores(),
    ]);

    // Transform ProductEstoque[] to Product[] to match expected type
    const transformedResponse: ResponseProductsToSalesComponent = {
      ...responseProducts,
      data: responseProducts.data.map(normalizeProduct),
    };

    return (
      <VendasPage
        responseProducts={transformedResponse}
        categories={categories}
        sellers={sellers}
      />
    );
  } catch (error) {
    console.error('Error loading sales page data:', error);

    // Return empty data structure on error
    const emptyResponse: ResponseProductsToSalesComponent = {
      data: [],
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: 10,
      to: 0,
      total: 0,
    };

    return (
      <VendasPage
        responseProducts={emptyResponse}
        categories={[]}
        sellers={[]}
      />
    );
  }
}
