import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  const isProduction =
    process.env.NEXT_PUBLIC_API_URL === 'https://alfa360.alfatecnologia.tech/api';

  const cookieOptions = {
    path: '/',
    domain: isProduction ? 'alfatecnologia.tech' : 'localhost',
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax' as const,
  };

  response.cookies.set('jwt_token', 'deleted', cookieOptions);
  response.cookies.set('jwt_refresh_token', 'deleted', cookieOptions);

  return response;
}
