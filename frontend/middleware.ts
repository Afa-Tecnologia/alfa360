import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUrl } from './lib/get-url';
export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;
  const publicPaths = ['/login'];

  const token = request.cookies.get('jwt_token');
  const refreshToken = request.cookies.get('jwt_refresh_token');
    const isDashboardRoute = pathname.startsWith('/dashboard-v2');
  const isLoginPage = pathname === '/login';

  // Se não tiver refreshToken, remove o token (expirado)
  if (!refreshToken) {
    request.cookies.delete('jwt_token');
  }

  // Se estiver na página de login e já tiver token e refreshToken, redireciona para o dashboard
  if (isLoginPage && token && refreshToken) {
    return NextResponse.redirect(new URL(getUrl('/dashboard-v2')));
  }

  // Se estiver tentando acessar /dashboard-v2 mas não tem token, redireciona para login
  if (isDashboardRoute && (!token || !refreshToken)) {
    return NextResponse.redirect(new URL(getUrl('/login')));
  }

  // Se está acessando fora de /dashboard-v2, mas tem token, redireciona para /dashboard-v2
  if (!isDashboardRoute && token && refreshToken && !isLoginPage) {
    return NextResponse.redirect(new URL(getUrl('/dashboard-v2')));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
};
