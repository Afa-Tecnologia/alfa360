// utils/api.ts
import useAuthStore from '@/stores/authStore';
import { cookies } from 'next/headers';

// Função wrapper para substituir o Axios
export async function fetchApi(
  input: RequestInfo | URL,
  init?: RequestInit,
  isFormData: boolean = false
): Promise<Response> {
  // Configuração base
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  // Configura headers
  const headers = new Headers(init?.headers);

  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
    }
  }

  // Configuração final da requisição
  const config: RequestInit = {
    ...init,
    headers,
  };

  // Faz a requisição com o fetch nativo
  const response = await fetch(`${baseUrl}${input}`, config);

  if (!response.ok) {
    console.log(response);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
