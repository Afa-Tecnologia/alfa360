import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { Product } from '@/types/product';
import { CartItem as CartProduct } from '@/stores/cart-store';
import { gerarNotificacao } from '@/utils/toast';

export function useCartManagement() {
  const { addItem, items } = useCartStore();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleAddToCart = (selectedProduct: Product | null, quantity: number) => {
    if (selectedProduct) {
      addItem(selectedProduct as any, quantity, 0);
      gerarNotificacao('success', 'Produto adicionado ao carrinho');
      return true;
    }
    return false;
  };

  const handleQuickAddToCart = (product: Product) => {
    addItem(product as any, 1, 0);
    gerarNotificacao('success', 'Produto adicionado ao carrinho');
  };

  const handleFinalizeSale = () => {
    if (items.length === 0) {
      gerarNotificacao(
        'warning',
        'Adicione produtos ao carrinho antes de finalizar a venda'
      );
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  return {
    handleAddToCart,
    handleQuickAddToCart,
    handleFinalizeSale,
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
  };
}