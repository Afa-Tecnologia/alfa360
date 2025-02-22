export interface IEstoque {
  products?: Product[] | any;
  children?: React.ReactElement;
}

export type Product = {
  id?: number;
  name?: string;
  description?: string;
  type?: string;
  purchase_price?: number;
  selling_price?: number;
  quantity?: number;
  total_stock?:number
  categoria_id?: number | string;
  brand?:string,
  variantes?: Variant[] | Variant;
};

export type Variant = {
  id?: number;
  id_product?: number;
  name?: string | any;
  type?: string;
  color?: string | string[];
  size?: string | string[];
  quantity?: number;
  active?: boolean;
  selling_price?: number;
  image_url?:string
};

export type ImageData = {
  id: string | number;
  variante_id: string | number;
  url: string;
};
