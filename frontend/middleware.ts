import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicPaths = ['/login'];

  const token = request.cookies.get('jwt_token');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/login';

  // Redireciona para login se estiver em rota protegida sem token
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Caso contrário, segue o fluxo normal

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
};
