'use client';

import { useState, useEffect } from 'react';
import { VendasDashboard } from '@/components/dashboard-v2/vendas/dashboard';
import { Product } from '@/types/sales';
import { User } from '@/lib/services/UserService';
import { api } from '@/app/api/api';
import { useToast } from '@/components/ui/use-toast';
import ProductService from '@/services/productService';
import { userService } from '@/lib/services/UserService';
import { ProductEstoque, ResponseProducts, ResponseProductsToSalesComponent } from '@/types/product';

interface VendasPageProps {
  responseProducts: ResponseProductsToSalesComponent
  sellers: User[];
  categories: any[];
}

export default function VendasPage({ responseProducts, sellers, categories }: VendasPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  return (
    <VendasDashboard
      responseProducts={responseProducts}
      sellers={sellers}
      categories={categories}
      isLoading={isLoading}
    />
  );
}
