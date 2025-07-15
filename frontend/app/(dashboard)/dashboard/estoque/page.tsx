import EstoquePage from '@/components/dashboard-v2/pages/EstoquePage';
import { ProductServiceEstoque } from '@/services/products/productEstoqueService';

import { tiposDeProdutosService } from '@/services/TiposDeProdutosService';

export default async function Page() {
  const productService = new ProductServiceEstoque();
  const fetchProducts = async () => {
    try {
      const products = await productService.getProducts();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const fetchTiposDeProdutos = async () => {
    try {
      const response = await tiposDeProdutosService.getAll();
      return response;
    } catch (error) {
      console.error('Error fetching tipos de produtos:', error);
      return [];
    }
  };

  const fetchAtributosVarianteByBusiness = async () => {
    try {
      const response = await productService.getAtributosVarianteByBusiness();
      return response;
    } catch (error) {
      console.error('Error fetching atributos variante by business:', error);
      return [];
    }
  };

  const products = await fetchProducts();
  const categories = await fetchCategories();
  const tiposDeProdutos = await fetchTiposDeProdutos();
  const atributosVariante = await fetchAtributosVarianteByBusiness();
  return (
    <EstoquePage
      products={products}
      categories={categories}
      tiposDeProdutos={tiposDeProdutos}
      atributosVariante={atributosVariante}
    />
  );
}
