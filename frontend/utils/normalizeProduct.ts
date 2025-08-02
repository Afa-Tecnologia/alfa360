import { Product, Variant } from '@/types/sales';

export function normalizeProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    sellingPrice: Number(apiProduct.selling_price),
    purchasePrice: Number(apiProduct.purchase_price),
    quantity: Number(apiProduct.quantity),
    brand: apiProduct.brand,
    code: apiProduct.code,
    category_id: apiProduct.categoria_id,
    stock: Number(apiProduct.quantity),
    image: null, // ou apiProduct.image se existir
    variants: (apiProduct.variants || []).map((variant: any) => ({
      id: variant.id,
      name: variant.name,
      quantity: Number(variant.quantity),
      images: variant.images || [],
      atributos: variant.atributos || [], // Lista dinâmica de atributos
    })),
    category: '', // pode buscar pelo id se necessário
    createdAt: new Date(apiProduct.created_at),
    updatedAt: new Date(apiProduct.updated_at),
  };
}
