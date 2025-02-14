import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const pathname = request.nextUrl.pathname;
  const token = cookieStore.get('access_token');

  
    // Rotas públicas
    const publicPaths = ['/login', '/', '/dashboard', '/dashboard/caixa', '/dashboard/estoque'];
    if (!publicPaths.includes(pathname) && !token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
}




export const config = {
  matcher: '/dashboard/:path*',
};
