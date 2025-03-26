import { create } from 'zustand';
import { categoryService } from '@/lib/services/CategoryService';

export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryService.getAllCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao buscar categorias',
        isLoading: false,
      });
    }
  },

  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoryService.createCategory(data);

      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));

      return newCategory;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao criar categoria',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCategory = await categoryService.updateCategory(id, data);

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        isLoading: false,
      }));

      return updatedCategory;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar categoria',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.deleteCategory(id);

      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao excluir categoria',
        isLoading: false,
      });
      throw error;
    }
  },
}));
