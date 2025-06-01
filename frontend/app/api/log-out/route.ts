import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Zera os cookies com HttpOnly
  response.cookies.set('jwt_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  response.cookies.set('jwt_refresh_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}
