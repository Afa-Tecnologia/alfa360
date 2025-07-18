import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types/sales';
import { normalizeProduct } from '@/utils/normalizeProduct';
import { ProductServiceEstoque } from '@/services/products/productEstoqueService';

export function useProducts(initialProducts: Product[], categories: any[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  
  // Busca produtos da API e normaliza
  const fetchProducts = async () => {
    const productService = new ProductServiceEstoque();
    setLoading(true);
    const response = await productService.getProducts();
    setProducts(response.data.map(normalizeProduct));
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.category_id === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return {
    products,
    setProducts,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    loading,
    fetchProducts,
  };
}
