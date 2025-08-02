'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { Category, ProductEstoque } from '@/types/product';
import type { IProductService } from '@/services/products/productEstoqueService';

export function useProducts(productService: IProductService) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const deleteProduct = async (id: number | string) => {
    try {
      await productService.deleteProduct(id);
      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o produto',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteProducts = async (ids: (number | string)[]) => {
    try {
      await productService.deleteProducts(ids);
      toast({
        title: 'Sucesso',
        description: `${ids.length} produtos excluídos com sucesso`,
      });
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir os produtos selecionados',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const refreshProducts = async () => {
    // Recarrega a página para buscar novos dados do servidor
    window.location.reload();
  };

  return {
    isLoading,
    deleteProduct,
    deleteProducts,
    refreshProducts,
    setIsLoading,
  };
}
