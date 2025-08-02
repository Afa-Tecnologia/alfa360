import { Atributos } from "./estoque";
import { Product as ProductSales } from '@/types/sales';
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
  atributos?: Atributos[];
  variants: Variant[];
  [key: string]: any;
}

export interface ResponseProducts{
  current_page?: string | number
  data: ProductEstoque[];
  from?: string | number,
  last_page?: string | number,
  per_page?: string | number,
  prev_page_url?: any,
  to?: string | number,
  total?: string | number
}

export interface ResponseProductsToSalesComponent{
  current_page?: string | number
  data: ProductSales[];
  from?: string | number,
  last_page?: string | number,
  per_page?: string | number,
  prev_page_url?: any,
  to?: string | number,
  total?: string | number
}

export type Variant = {
  id: number;
  name: string;
  color: string;
  size: string;
  stock: number;
  quantity: number;
  images: string[];
  atributos: Atributos[];
  [key: string]: any;
};

export interface AtributoPivot {
  tipo_de_negocios_id: number;
  atributo_id: number;
}

export interface AtributoTipoDeNegocio {
  id: number;
  name: string;
  pivot: AtributoPivot;
}

export interface ResponseAtributos  {
  id: number;
  nome: string;
  descricao: string;
  ativo: number;
  tenant_id: number | null;
  atributos: AtributoTipoDeNegocio[];
}



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
