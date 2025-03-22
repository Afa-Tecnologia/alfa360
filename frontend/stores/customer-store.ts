import { create } from "zustand";

export type Customer = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  cpf: string;
  adress: string;
  city: string;
  state: string;
  cep: string;
  date_of_birth: string;
  created_at: Date;
  updated_at: Date;
  orders_count?: number;
  total_spent?: number;
};



type CustomerStore = {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Omit<Customer, "id" | "created_at" | "updated_at">) => void;
  updateCustomer: (id: number, customer: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>) => void;
  deleteCustomer: (id: number) => void;
  getCustomer: (id: number) => Customer | undefined;
};

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],

  setCustomers: (customers) => {
    const parsedCustomers = customers.map((customer) => ({
      ...customer,
      created_at: customer.created_at,
      updated_at: customer.updated_at,
    }));

    set({ customers: parsedCustomers });
  },

  addCustomer: (customer) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now(),
      created_at: new Date(),
      updated_at: new Date(),
      orders_count: 0,
      total_spent: 0,
    };

    set((state) => ({
      customers: [...state.customers, newCustomer],
    }));
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
          : customer
      ),
    }));
  },

  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
    }));
  },

  getCustomer: (id) => {
    return get().customers.find((customer) => customer.id === id);
  },
}));
