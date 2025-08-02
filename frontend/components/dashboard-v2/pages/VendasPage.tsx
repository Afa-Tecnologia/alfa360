'use client';

import { useState, useEffect } from 'react';
import { VendasDashboard } from '@/components/dashboard-v2/vendas/VendasDashboard';
import { User, userService } from '@/lib/services/UserService';
import { useToast } from '@/components/ui/use-toast';
import { ResponseProductsToSalesComponent } from '@/types/product';

interface VendasPageProps {
  responseProducts: ResponseProductsToSalesComponent;
  sellers: User[];
  categories: any[];
}

export default function VendasPage({
  responseProducts,
  sellers,
  categories,
}: VendasPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <VendasDashboard
      responseProducts={responseProducts}
      sellers={sellers}
      categories={categories}
      isLoading={isLoading}
    />
  );
}
