// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
// import { jwtDecode } from 'jwt-decode';
// import { api } from './app/api/api';

// export async function middleware(request: NextRequest) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('jwt_token');

//   // Se não há token, redireciona para login
//   if (!token) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   try {
//     // Verifica se o token está expirado
//     const decodedToken = jwtDecode(token.value);
//     const isExpired = decodedToken.exp && decodedToken.exp * 1000 < Date.now();

//     // Se o token está expirado, tenta renovar
//     if (isExpired) {
//       const refreshToken = cookieStore.get('jwt_refresh_token');

//       if (!refreshToken) {
//         return NextResponse.redirect(new URL('/login', request.url));
//       }

//       // Chama a API para renovar o token (ela já vai definir os cookies)
//       try {
//         await fetch('/refresh', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
          
//         });
//         console.log('Token renovado com sucesso');
//         // Continua normalmente após renovar o token
//         return NextResponse.next();
//       } catch (error) {
//         // Se falhar o refresh, redireciona para login
//         return NextResponse.redirect(new URL('/login', request.url));
//       }
//     }
//   } catch (error) {
//     // Se houver qualquer erro na validação do token, redireciona para login
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Token válido, continua normalmente
//   return NextResponse.next();
// }

// export const config = {
//   matcher: '/dashboard-v2/:path*',
// };


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt_token');

  if (!token) {
    console.log('0. Token não encontrado');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decodedToken = jwtDecode<{ exp: number }>(token.value);
    const isExpired = decodedToken.exp && decodedToken.exp * 1000 < Date.now();

    if (isExpired) {
      console.log('1. Token expirado, tentando renovar');
      const refreshToken = cookieStore.get('jwt_refresh_token');
      if (!refreshToken) {
        console.log('2. Token de refresh não encontrado');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      try {
        console.log('3. Tentando renovar o token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `jwt_refresh_token=${refreshToken.value}`,
          },
          body: JSON.stringify({
            refresh_token: refreshToken.value,
          }),
        });

        if (!response.ok) {
          throw new Error('Falha ao renovar o token');
        }

        console.log('4. Token renovado com sucesso');

        return NextResponse.next();
      } catch (err) {
        console.log('5. Falha ao renovar o token');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  } catch (err) {
    console.log('6. Erro ao validar o token');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard-v2/:path*',
};
