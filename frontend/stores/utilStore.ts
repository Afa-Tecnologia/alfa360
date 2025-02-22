/**
 * Store Usada para qualquer coisa abstrata no projeto
 * Que não está atrelada a um componente especifico
 */
import { create } from 'zustand';

interface UtilStore {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;

  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}

export const useUtilStore = create<UtilStore>((set) => ({
  //Store para setar o estado do Sheet
  isSheetOpen: false,
  setIsSheetOpen: (isSheetOpen) => set({ isSheetOpen }),
  isDialogOpen: false,
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
}));
