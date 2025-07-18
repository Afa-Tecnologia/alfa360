import { Atributos } from './estoque';

export type ScannedItem = {
  code: string;
  quantity: number;
};

export interface Variant {
  id: number;
  name: string;
  quantity: number;
  images: string[];
  atributos: Atributos[]; // Lista dinâmica de atributos
}

export interface Product {
  id: number;
  name: string;
  description: string;
  sellingPrice: number;
  quantity: number;
  image: string | null;
  brand: string;
  code: string;
  category_id: number;
  variants: Variant[];
  purchasePrice: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
