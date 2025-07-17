import { ProductServiceEstoque } from "@/services/products/productEstoqueService"
import ProductService from "@/services/products/ProductServices"
import type { LocalProduct, ProductStats, ProductEstoque } from "@/types/product"


export class ProductCalculator {
  static calculateStats(products: ProductEstoque[]): ProductStats {
    const totalProducts = products.length
    const totalValue = products.reduce(
      (acc, product) => acc + (Number(product.purchase_price) || 0) * (Number(product.quantity) || 0),
      0,
    )
    const lowStock = products.filter((product) => Number(product.quantity) < 5).length
    const outOfStock = products.filter((product) => Number(product.quantity) === 0).length

    return { totalProducts, totalValue, lowStock, outOfStock }
  }

  static convertToLocalProduct(product: ProductEstoque): LocalProduct {
    return {
      id: product.id || 0,
      name: product.name || "",
      brand: product.brand || "",
      quantity: product.quantity || 0,
      selling_price: Number(product.selling_price || 0),
      purchase_price: Number(product.purchase_price || 0),
      categoria_id: Number(product.categoria_id),
      code: product.code,
    }
  }
}

export class ProductFilter {
  static async filterProductsFromAPI(
    searchTerm: string,
    filterCategory: string,
    sortField: keyof ProductEstoque,
    sortOrder: "asc" | "desc"
  ): Promise<ProductEstoque[]> {
    try {
      // 🔍 Busca os produtos via API
      const productService = new ProductServiceEstoque();
      let result: ProductEstoque[] = await productService.getProductsBySearchTerm(searchTerm);

      // 🏷️ Filtro por categoria (se necessário)
      if (filterCategory && filterCategory !== "all") {
        result = result.filter(
          (product) => product.categoria_id?.toString() === filterCategory
        );
      }

      // ↕️ Ordenação
      result = result.sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return sortOrder === "asc"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        } else {
          const numA = Number(fieldA) || 0;
          const numB = Number(fieldB) || 0;
          return sortOrder === "asc" ? numA - numB : numB - numA;
        }
      });

      return result;
    } catch (error) {
      console.error("Erro ao filtrar produtos:", error);
      return [];
    }
  }
}

export class CurrencyFormatter {
  static format(value: number | string): string {
    const numericValue = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue || 0)
  }
}
