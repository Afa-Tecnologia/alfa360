import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import useAuthStore from './stores/authStore';
import { cookies } from 'next/headers';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/dashboard/:path*',
};