import { create } from 'zustand';

export type Variant = {
  id: number;
  name: string;
  color: string;
  size: string;
  stock: number;
  quantity: number;
  images: string[];
  [key: string]: any;
};

export type Product = {
  id?: number | string;
  name: string;
  description: string;
  type: string,
  code?: string,
  categoria_id: number | string;
  purchase_price: number | string;
  selling_price: number | string;
  quantity: number | string;
  brand: string;
  variants: Variant[];
  [key: string]: any;
};

type ProductStore = {
  products: Product[];
  setProducts: (products: Product[]) => void
  
  product: Product;
  setCurrentProduct: (product: Product) => void;

  addProduct: (product: Product) => void;
  
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (id: number | string) => void;

  tipoProduto: string | null;
  setTipoProduto: (tipoProduto: string) => void;

  selectedCategoria: string | number;
  setSelectedCategoria: (categoria: string | number) => void;

  sellingPrice: number;
  setSellingPrice: (selling_price:number) => void;

  purchasePrice:number,
  setPurchasePrice: (purchase_price:number) => void

};

export const mockProducts = [
  {
    id: '1',
    name: 'Camisa Social',
    description: 'Camisa social de algodão premium',
    purchase_price: 100,
    selling_price: 150,
    quantity: 200,
    brand: 'Lesamis',
    type: 'sapato',
    categoria_id:1,
    code: "1928",
    variants: [
      {
        id: '1-1',
        name: 'Camisa Social Branca P',
        color: 'Branca',
        size: 'P',
        stock: 15,
        images: ['/images/camisa-branca1.jpg', '/images/camisa-branca2.jpg'],
      },
      {
        id: '1-2',
        name: 'Camisa Social Azul M',
        color: 'Azul',
        size: 'M',
        stock: 8,
        images: ['/images/camisa-azul1.jpg'],
      }
    ],
  },
  {
    id: '2',
    name: 'Tênis Esportivo',
    description: 'Tênis confortável para corrida',
    purchase_price: 100,
    selling_price: 150,
    quantity: 200,
    brand: 'Lesamis',
    type: 'roupa',
    code: "19283",
    categoria_id:1,
    variants: [
      {
        id: '2-1',
        name: 'Tênis Preto 40',
        color: 'Preto',
        size: '40',
     
        stock: 10,
        images: ['/images/tenis-preto1.jpg', '/images/tenis-preto2.jpg'],
      },
      {
        id: '2-2',
        name: 'Tênis Branco 42',
        color: 'Branco',
        size: '42',
     
        stock: 5,
        images: ['/images/tenis-branco.jpg'],
      },
    ],
  },
  {
    id: '3',
    name: 'Relógio Smartwatch',
    description: 'Relógio inteligente com várias funções',
    purchase_price: 100,
    selling_price: 150,
    quantity: 200,
    brand: 'Lesamis',
    type: 'roupa',
    categoria_id:1,
    code: "19284",
    variants: [
      {
        id: '3-1',
        name: 'Smartwatch Preto',
        color: 'Preto',
        size: 'Único',
        stock: 12,
        images: ['/images/smartwatch-preto.jpg'],
      },
      {
        id: '3-2',
        name: 'Smartwatch Azul',
        color: 'Azul',
        size: 'Único',
        stock: 7,
        images: ['/images/smartwatch-azul.jpg'],
      },
    ],
  },
  {
    id: '4',
    name: 'Mochila de Couro',
    description: 'Mochila espaçosa e resistente',
    purchase_price: 133,
    selling_price: 122,
    quantity: 200,
    brand: 'Lesamis',
    type: 'roupa',
    categoria_id:1,
    code: "192844",
    variants: [
      {
        id: '4-1',
        name: 'Mochila Marrom',
        color: 'Marrom',
        size: 'Grande',

        stock: 20,
        images: ['/images/mochila-marrom.jpg'],
      },
      {
        id: '4-2',
        name: 'Mochila Preta',
        color: 'Preto',
        size: 'Média',
        stock: 18,
        images: ['/images/mochila-preta.jpg'],
      },
    ],
  },
];

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products: Product[]) => set({ products }),

  product: {
    id: '',
    name: '',
    description: '',
    purchase_price: 0,
    selling_price: 0,
    quantity: 0,
    brand: '',
    type: '',
    variants: [],
    categoria_id: 0,
  },
  setCurrentProduct: (product: Product) => set({ product }),

  tipoProduto: null,
  setTipoProduto: (tipoProduto) => set({ tipoProduto }),

  selectedCategoria: '',
  setSelectedCategoria: (categoria) => set({ selectedCategoria: categoria }),

  sellingPrice:0,
  setSellingPrice: (selling_price:number) => set({sellingPrice:selling_price}),

  purchasePrice:0,
  setPurchasePrice: (purchase_price:number) => set({purchasePrice: purchase_price}),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    })),

  deleteProduct: (productId) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    })),

  // 🔥 Função para adicionar uma variante a um produto existente
  addVariant: (productId:number | string , variant:Variant) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, variants: [...p.variants, variant] } : p
      ),
    })),

  // 🔥 Função para editar uma variante específica
  updateVariant: (productId:number | string , variantId:number | string, updatedVariant:Variant) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              variants: p.variants.map((v) =>
                v.id === variantId ? updatedVariant : v
              ),
            }
          : p
      ),
    })),

  // 🔥 Função para remover uma variante específica
  deleteVariant: (productId:number | any, variantId:number | any) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              variants: p.variants.filter((v) => v.id !== variantId),
            }
          : p
      ),
    })),
}));
