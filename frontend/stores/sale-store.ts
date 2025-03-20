import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SaleItem = {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export type Sale = {
  id: string
  items: SaleItem[]
  total: number
  paymentMethod: string
  createdAt: Date
  customerId?: string
  customerName?: string
}

type SaleStore = {
  sales: Sale[]
  addSale: (sale: Omit<Sale, "id" | "createdAt">) => void
  deleteSale: (id: string) => void
  getSale: (id: string) => Sale | undefined
}

export const useSaleStore = create<SaleStore>()(
  persist(
    (set, get) => ({
      sales: [],
      addSale: (sale) => {
        const newSale = {
          ...sale,
          id: Date.now().toString(),
          createdAt: new Date(),
        }
        set((state) => ({
          sales: [...state.sales, newSale],
        }))
      },
      deleteSale: (id) => {
        set((state) => ({
          sales: state.sales.filter((sale) => sale.id !== id),
        }))
      },
      getSale: (id) => {
        return get().sales.find((sale) => sale.id === id)
      },
    }),
    {
      name: "sale-storage",
    },
  ),
)

