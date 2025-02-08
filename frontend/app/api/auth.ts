'use server';
import { api } from './api';
import { jwtDecode } from 'jwt-decode';
import { LoginResponse, DecodedToken, User } from '../../types/auth';
import useAuthStore from '@/stores/authStore';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginData } from '../../types/auth';

export const login = async (loginData: LoginResponse): Promise<void> => {
  const data = await loginData;
  const cookieStore = await cookies();
  cookieStore.set('access_token', data.access_token, { httpOnly: true }); // Persist token
  redirect('/dashboard');
};

export const deleteServerCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('access_token'); // Limpar token persistido
  redirect('/login');
};

export async function getServerCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // Devolve o token para ser usado no cliente
  return token || '';
}
