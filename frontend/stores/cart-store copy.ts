import { create } from 'zustand';
import type { Product } from '@/types/sales';

export type CartItem = Product & {
  quantity: number;
  discountPercentage: number;
  vendedor_id?: number;
  vendedor_nome?: string;
  variante_id?: number;
};

type CartStore = {
  discount: number;
  items: CartItem[];
  addItem: (
    product: Product & {
      vendedor_id?: number;
      vendedor_nome?: string;
      selectedColor?: string;
      selectedSize?: string;
      selectedColorId?: number;
    },
    quantity: number,
    discountPercentage: number
  ) => void;
  removeItem: (productId: number, varianteId?: number) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    varianteId?: number
  ) => void;
  setDiscount: (discount: number) => void;
  clearCart: () => void;
  total: () => number;
  totalWithDiscount: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  discount: 0, // Estado para o desconto

  addItem: (product, quantity = 1, discountPercentage = 0) => {
    set((state) => {
      // Verificar se já existe um item com o mesmo ID e mesma variante
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === product.id &&
          (product.variants[0].id
            ? item.variants[0].id === product.variants[0].id
            : true)
      );

      if (existingItemIndex !== -1) {
        // Atualizar o item existente
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          discountPercentage,
        };
        return { items: updatedItems };
      }

      // Processar a imagem do produto
      const processedProduct = {
        ...product,
        image: product.image ? product.image.replace(/\\/g, '/') : null,
        quantity,
        discountPercentage,
      };

      return {
        items: [...state.items, processedProduct],
      };
    });
  },

  removeItem: (productId, varianteId) => {
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(
            item.id === productId &&
            (varianteId ? item.variante_id === varianteId : true)
          )
      ),
    }));
  },

  updateQuantity: (productId, quantity, varianteId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId &&
        (varianteId ? item.variante_id === varianteId : true)
          ? { ...item, quantity }
          : item
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
      (total, item) => total + item.sellingPrice * item.quantity,
      0
    );
    return subtotal;
  },

  totalWithDiscount: () => {
    const subtotal = get().total();
    return subtotal - get().discount;
  },
}));
