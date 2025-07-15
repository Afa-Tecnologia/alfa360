'use client';

import { useState, useEffect } from 'react';
import { VendasDashboard } from '@/components/dashboard-v2/vendas/dashboard';
import { Product } from '@/types/sales';
import { User } from '@/lib/services/UserService';
import { api } from '@/app/api/api';
import { useToast } from '@/components/ui/use-toast';
import ProductService from '@/services/productService';
import { userService } from '@/lib/services/UserService';
import { ProductEstoque } from '@/types/product';

interface VendasPageProps {
  products: Product[];
  sellers: User[];
  categories: any[];
}

export default function VendasPage({ products, sellers, categories }: VendasPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  return (
    <VendasDashboard
      products={products}
      sellers={sellers}
      categories={categories}
      isLoading={isLoading}
    />
  );
}
