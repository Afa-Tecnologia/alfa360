'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const deleteServerCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('jwt_token'); // Limpar token persistido
  cookieStore.delete('jwt_refresh_token');
  redirect('/login');
};

export async function getServerCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt_token')?.value;

  // Devolve o token para ser usado no cliente
  return token || '';
}

export async function getAuthToken() {

    const cookieStore = await cookies();
    return cookieStore.get('jwt_token')?.value || null;
 
}

export async function getRefreshToken() {
 
    const cookieStore = await cookies();
    return cookieStore.get('jwt_refresh_token')?.value || null;
 
}

export async function setAuthToken(token: string, name: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: name,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });
    return true;
  } catch (error) {
    console.error('Erro ao definir cookie:', error);
    return false;
  }
}

export async function removeAuthToken() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('jwt_token');
    return true;
  } catch (error) {
    console.error('Erro ao remover cookie:', error);
    return false;
  }
}
export async function removeRefreshToken() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('jwt_refresh_token');
    return true;
  } catch (error) {
    console.error('Erro ao remover cookie:', error);
    return false;
  }
}
