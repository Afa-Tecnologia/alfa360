import { api } from "@/app/api/api"
import type {Category, ProductEstoque } from "@/types/product"

export interface IProductService {
  getProducts(): Promise<ProductEstoque[]>
  getCategories(): Promise<Category[]>
  deleteProduct(id: number | string): Promise<void>
  deleteProducts(ids: (number | string)[]): Promise<void>
}

export class ProductServiceEstoque implements IProductService {
  async getProducts(): Promise<ProductEstoque[]> {
    const response = await api.get("/produtos")
    return response.data
  }

  async getCategories(): Promise<Category[]> {
    const response = await api.get("/categorias")
    return response.data
  }

  async deleteProduct(id: number | string): Promise<void> {
    await api.delete(`/produtos/${id}`)
  }

  async deleteProducts(ids: (number | string)[]): Promise<void> {
    await Promise.all(ids.map((id) => this.deleteProduct(id)))
  }
}
