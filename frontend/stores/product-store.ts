import { Variant } from "@/types/estoque";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: number;
  name: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  quantity: number;
  category: string;
  image?: string | null;
  brand: string;
  code: string;
  category_id: number;
  createdAt: Date;
  updatedAt: Date;
  variants: Variant[];
  selectedColor?: string; 
  selectedSize?: string;  
  selectedColorId?:number;
};

type ProductStore = {
  products: Product[];
  setProducts: (products: any[]) => void;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  updateProduct: (id: number, product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => void;
  deleteProduct: (id: number) => void;
  getProduct: (id: number) => Product | undefined;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],

      // 🔥 Novo método para definir os produtos recebidos da API
      setProducts: (products) => {
        const formattedProducts = products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          purchasePrice: product.purchase_price,
          sellingPrice: product.selling_price,
          stock: product.quantity,
          category: product.type,
          image: product.image,
          brand: product.brand,
          code: product.code,
          quantity : product?.quantity,
          category_id: product.categoria_id,
          createdAt: new Date(product.created_at),
          updatedAt: new Date(product.updated_at),
          variants: product.variants || [],
        }));

        set({ products: formattedProducts });
      },

      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: Date.now(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...updatedProduct,
                  updatedAt: new Date(),
                }
              : product
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      getProduct: (id) => {
        return get().products.find((product) => product.id === id);
      },
    }),
    {
      name: "product-storage",
    }
  )
);
