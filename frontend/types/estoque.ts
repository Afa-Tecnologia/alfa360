export interface IEstoque {
  products?: Product[] | any;
  children?: React.ReactElement;
}

export type Product = {
  id: number;
  name: string;
  description: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  categoria_id?: number;
  variantes: Variant[] | Variant;
};

export type Variant = {
  id: number;
  name: string;
  type: string;
  color: string;
  size: string;
  stock: number;
  active: boolean;
  price: number;
  imagens: ImageData[];
};

export type ImageData = {
  id: string | number;
  variante_id: string | number;
  url: string;
};
