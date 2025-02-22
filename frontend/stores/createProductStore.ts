// store/useProductStore.ts
import { create } from 'zustand';
import { Product as ProducWithVariants } from '@/types/estoque';
import { Variant } from '@/types/estoque';

interface ProductStore {
  products: ProducWithVariants[] | null;
  _setProducts: (product: ProducWithVariants[]) => void;

  productsStore: ProducWithVariants;
  setProductsStore: (products: ProducWithVariants[]) => void;

  productStore: ProducWithVariants;
  setProductStore: (product: ProducWithVariants) => void;
  resetProduct: () => void;

  size: string[] | null;
  setSize: (size: string[] | null) => void;

  tipoProduto: string | null;
  setTipoProduto: (tipoProduto: string) => void;

  categoria: number | string | null;
  setCategoria: (categoria: string | number) => void;

  color: string[] | string | null;
  setColor: (color: string[]) => void;

  selectedCategoria: string | number;
  setSelectedCategoria: (categoria: string | number) => void;

  selectedTipoProduto: string | null;
  setSelectedTipoProduto: (tipoProduto: string) => void;

  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;

  imageUrl: string | null;
  setImageUrl: (size: string | null) => void;

  variants: Variant[];
  setVariants: (variant: Variant[]) => void;
  addVariant: (variant: Variant | Variant[]) => boolean;
  removeVariant: (id: number) => void;

  //** Para edição de variante especifica */

  variant: Variant;
  setVariant: (variant: Variant) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: null,
  _setProducts: (products) => set({ products }),
  productStore: {
    id: 0,
    name: '',
    categoria_id: 0,
    brand: '',
    description: '',
    purchase_price: 0,
    selling_price: 0,
    quantity: 0,
    variantes: [],
    type: '',
  },
  setProductStore: (productStore) => set({ productStore }),
  resetProduct: () =>
    set({
      productStore: {
        id: 0,
        name: '',
        categoria_id: 0,
        brand: '',
        description: '',
        purchase_price: 0,
        selling_price: 0,
        quantity: 0,
        variantes: [],
        type: '',
      },
    }),

  productsStore: [],
  setProductsStore: (productsStore) => set({ productsStore }),

  size: [],
  setSize: (size) => set({ size }),

  imageUrl: null,
  setImageUrl: (imageUrl) => set({ imageUrl }),

  tipoProduto: null,
  setTipoProduto: (tipoProduto) => set({ tipoProduto }),

  categoria: null,
  setCategoria: (categoria) => set({ categoria }),

  color: [],
  setColor: (color) => set({ color }),

  selectedCategoria: '',
  setSelectedCategoria: (categoria) => set({ selectedCategoria: categoria }),

  selectedTipoProduto: null,
  setSelectedTipoProduto: (tipoProduto) =>
    set({ selectedTipoProduto: tipoProduto }),

  selectedSize: null,
  setSelectedSize: (size) => set({ selectedSize: size }),

  variant: {},
  setVariant: (variant: Variant) => set({ variant }),

  variants: [],
  setVariants: (variants) => set({ variants }),
  addVariant: (variant) => {
    set((state) => ({ variants: [...state.variants, variant] }));
    return true; // Retorna `true` após adicionar.
  },
  removeVariant: (id) =>
    set((state) => ({
      variants: state.variants.filter((variant) => variant.id !== id),
    })),
}));
