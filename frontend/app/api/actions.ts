'use server';
import { loginData, LoginResponse } from '@/types/auth';
import { login } from './auth';

export async function loginAction(data: LoginResponse) {
  return login(data);
}
