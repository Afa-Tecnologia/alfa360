

import { api } from "@/app/api/api";


export async function logout() {
  try {
    const response = await api.post('/logout', {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}