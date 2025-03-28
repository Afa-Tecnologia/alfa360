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
  categoria_id?: number | string;
  brand?:string,
  code?:string,
  variants?: Variant[];
};

export type Variant = {
  id?: number;
  produto_id?: number;
  name?: string | any;
  type?: string;
  color?: string | string[];
  size?: string | string[];
  quantity?: number;
  active?: boolean;
  images: string[]
};
