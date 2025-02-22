import { create } from "zustand";
import { useProductStore } from "./productStore";

type UIStore = {
  isOpen: boolean;
  editingProductId: number | null | string;
  openForm: (productId?: number | string | null) => void;
  closeForm: () => void;
};
export const useUIStore = create<UIStore>((set) => ({
  isOpen: false,
  editingProductId: null,
  openForm: (productId?) => set({ isOpen: true, editingProductId: productId || null }),
  closeForm: () => set({ isOpen: false, editingProductId: null,   }),
}));
