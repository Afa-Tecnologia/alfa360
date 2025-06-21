export type Product = {
    id: number;
    name: string;
    description: string;
    purchase_price: number;
    selling_price: number;
    selectedColor?: string;
    selectedSize?: string;
    selectedColorId?: number;
    selectedSizeId?: number;
    quantity: number;
    color?: string;
    size?: string[];
    type: string;
    brand?: string;
    categoria_id?: number | string;
    image_url?: string;
  };
export interface ProductEstoque {
  id?: number | string;
  name: string;
  description: string;
  tipo_de_produto_id?: number | string;
  code?: string;
  categoria_id: number | string;
  purchase_price: number | string;
  selling_price: number | string;
  quantity: number | string;
  brand: string;
  variants: Variant[];
  [key: string]: any;
}

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



export interface LocalProduct {
  id: number | string
  name: string
  brand: string
  quantity: number | string
  selling_price: number
  purchase_price?: number
  categoria_id?: number
  code?: string
}

export interface Category {
  id: number
  name: string
}

export interface ProductStats {
  totalProducts: number
  totalValue: number
  lowStock: number
  outOfStock: number
}

export interface ProductFilters {
  searchTerm: string
  filterCategory: string
  sortOrder: "asc" | "desc"
  sortField: keyof ProductEstoque
}
