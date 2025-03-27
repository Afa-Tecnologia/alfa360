import { create } from 'zustand';
import type { Product } from './product-store';

export type CartItem = {
  product: Product;
  quantity: number;
  discountPercentage: number;
};

type CartStore = {
  discount: number;
  items: CartItem[];
  addItem: (
    product: Product,
    quantity: number,
    discountPercentage: number
  ) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  setDiscount: (discount: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  discount: 0, // Estado para o desconto

  addItem: (product, quantity = 1, discountPercentage = 0) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  discountPercentage,
                }
              : item
          ),
        };
      }

      const processedProduct = {
        ...product,
        image: product.image ? product.image.replace(/\\/g, '/') : null,
      };

      return {
        items: [
          ...state.items,
          {
            product: processedProduct,
            quantity,
            discountPercentage,
          },
        ],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  setDiscount: (discount) => {
    set({ discount });
  },

  clearCart: () => {
    set({ items: [], discount: 0 }); // Reseta o desconto ao limpar o carrinho
  },

  total: () => {
    const subtotal = get().items.reduce(
      (total, item) => total + item.product.sellingPrice * item.quantity,
      0
    );
    return subtotal - get().discount; // Aplica o desconto ao total
  },
}));
