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
  