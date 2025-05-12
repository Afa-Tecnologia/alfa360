'use client';

import { useState, useEffect } from 'react';
import { VendasDashboard } from '@/components/dashboard-v2/vendas/dashboard';
import { Product } from '@/types/sales';
import { User } from '@/lib/services/UserService';
import { api } from '@/app/api/api';
import { useToast } from '@/components/ui/use-toast';
import ProductService from '@/services/productService';
import { userService } from '@/lib/services/UserService';

export default function VendasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const { toast } = useToast();

  // Buscar produtos, categorias e vendedores
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Buscar categorias
        const categoriesData = await ProductService.getCategorys();
        setCategories(categoriesData);

        // Buscar produtos
        const productsData = await ProductService.getProducts();
        const formattedProducts: Product[] = productsData.map(
          (product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            sellingPrice: Number.parseFloat(product.selling_price),
            quantity: product.quantity,
            image: product.image ? product.image.replace(/\\/g, '/') : null,
            brand: product.brand,
            code: product.code,
            category_id: product.categoria_id,
            variants: product.variants || [],
            purchasePrice: Number.parseFloat(product.purchase_price || '0'),
            stock: product.quantity || 0,
            category: product.category || '',
            createdAt: new Date(product.created_at || Date.now()),
            updatedAt: new Date(product.updated_at || Date.now()),
          })
        );
        setProducts(formattedProducts);

        // Buscar vendedores usando o serviço
        const sellersData = await userService.getVendedores();
        console.log('Dados de vendedores obtidos:', sellersData);

        // Garantir que temos um array válido
        if (Array.isArray(sellersData)) {
          setSellers(sellersData);
        } else {
          console.error('Dados de vendedores não são um array:', sellersData);
          setSellers([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados necessários',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <VendasDashboard
      products={products}
      sellers={sellers}
      categories={categories}
      isLoading={isLoading}
    />
  );
}
