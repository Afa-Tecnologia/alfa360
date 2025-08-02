import { useState } from 'react';
import { Product } from '@/types/sales';

export function useCart() {
  const [items, setItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);

  const addItem = (
    product: Product,
    quantity: number,
    discountValue: number
  ) => {
    setItems((prev) => [
      ...prev,
      { ...product, quantity, discount: discountValue },
    ]);
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const total = () =>
    items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const totalWithDiscount = () => total() - discount;

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    discount,
    setDiscount,
    total,
    totalWithDiscount,
  };
}
