import { ProductServiceEstoque } from '@/services/products/productEstoqueService';
import ProductService from '@/services/products/ProductServices';
import type {
  LocalProduct,
  ProductStats,
  ProductEstoque,
} from '@/types/product';

export class ProductCalculator {
  static calculateStats(products: ProductEstoque[]): ProductStats {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (acc, product) =>
        acc +
        (Number(product.purchase_price) || 0) * (Number(product.quantity) || 0),
      0
    );
    const lowStock = products.filter(
      (product) => Number(product.quantity) < 5
    ).length;
    const outOfStock = products.filter(
      (product) => Number(product.quantity) === 0
    ).length;

    return { totalProducts, totalValue, lowStock, outOfStock };
  }

  static convertToLocalProduct(product: ProductEstoque): LocalProduct {
    return {
      id: product.id || 0,
      name: product.name || '',
      brand: product.brand || '',
      quantity: product.quantity || 0,
      selling_price: Number(product.selling_price || 0),
      purchase_price: Number(product.purchase_price || 0),
      categoria_id: Number(product.categoria_id),
      code: product.code,
    };
  }
}

export class CurrencyFormatter {
  static format(value: number | string): string {
    const numericValue =
      typeof value === 'string' ? Number.parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue || 0);
  }
}
