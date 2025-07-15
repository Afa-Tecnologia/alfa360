import { getAuthToken } from "./auth";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

//Chamada via fetch para obter o token de autenticação

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
