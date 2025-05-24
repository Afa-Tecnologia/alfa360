import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export async function middleware(request: NextRequest) {
 const pathname = request.nextUrl.pathname;

  const publicPaths = ['/login'];

  const token = request.cookies.get('jwt_token');
  const refreshToken = request.cookies.get('jwt_refresh_token');
    const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/login';

  // Se não tiver refreshToken, remove o token (expirado)
  if (!refreshToken) {
    request.cookies.delete('jwt_token');
  }
// Redireciona para /dashboard-v2 se estiver na /login e já estiver autenticado
  if (isLoginPage && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redireciona para login se estiver em rota protegida sem refreshToken
  if (isDashboardRoute && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redireciona usuários autenticados acessando outras rotas para /dashboard-v2
  if (!isDashboardRoute && token && refreshToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
};
