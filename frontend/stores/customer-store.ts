import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Customer = {
  id: number
  name: string
  last_name: string
  email: string
  phone: string
  cpf: string
  adress: string
  city: string
  state: string
  cep: string
  date_of_birth: string
  created_at: Date
  updated_at: Date
  status: "ativo" | "inativo"
  orders_count?: number
  total_spent?: number
}

type CustomerStore = {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "created_at" | "updated_at" | "status">) => void
  updateCustomer: (id: number, customer: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>) => void
  deleteCustomer: (id: number) => void
  getCustomer: (id: number) => Customer | undefined
  setCustomerStatus: (id: number, status: "ativo" | "inativo") => void
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: [],

      addCustomer: (customer) => {
        const newCustomer: Customer = {
          ...customer,
          id: Date.now(),
          created_at: new Date(),
          updated_at: new Date(),
          status: "ativo",
          orders_count: 0,
          total_spent: 0,
        }

        set((state) => ({
          customers: [...state.customers, newCustomer],
        }))
      },

      updateCustomer: (id, updatedCustomer) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? {
                  ...customer,
                  ...updatedCustomer,
                  updated_at: new Date(),
                }
              : customer,
          ),
        }))
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        }))
      },

      getCustomer: (id) => {
        return get().customers.find((customer) => customer.id === id)
      },

      setCustomerStatus: (id, status) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? {
                  ...customer,
                  status,
                  updated_at: new Date(),
                }
              : customer,
          ),
        }))
      },
    }),
    {
      name: "customer-storage",
    },
  ),
)

