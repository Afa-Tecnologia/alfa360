import { create } from 'zustand';

type UIStore = {
  isOpenCreate: boolean;
  setIsOpenCreate: (isOpen: boolean) => void;

  isOpenEdit: boolean;
  setIsOpenEdit: (isOpen: boolean) => void;

  editingProductId: number | null | string;
  openForm: (productId?: number | string | null) => void;
  closeForm: () => void;
};


export const useUIStore = create<UIStore>((set) => ({
  isOpenCreate: false,
  setIsOpenCreate: (isOpenCreate: boolean) => set({ isOpenCreate }),

  isOpenEdit: false,
  setIsOpenEdit: (isOpenEdit: boolean) => set({ isOpenEdit }),

  editingProductId: null,
  openForm: (productId?) =>
    set({ isOpenEdit: true, editingProductId: productId || null }),
  closeForm: () => set({ isOpenEdit: false, isOpenCreate: false, editingProductId: null }),
}));
