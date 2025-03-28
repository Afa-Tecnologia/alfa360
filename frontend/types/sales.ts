export type ScannedItem = {
    code: string;
    quantity: number;
  };
  
  export interface Variant {
    id: number;
    color: string;
    size: string;
    quantity: number;
    name: string;
    images: string[];
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
    selectedColor?: string;
    selectedSize?: string;
    selectedColorId?: number;
    purchasePrice: number;
    stock: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }