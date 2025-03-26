<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HandleExpiredToken
{
    public function handle(Request $request, Closure $next): JsonResponse
    {
        try {
            return $next($request);
        } catch (AuthenticationException $e) {
            return response()->json([
                'error' => [
                    'code' => 'TOKEN_EXPIRED',
                    'message' => 'Seu token de acesso expirou. Por favor, faça login novamente.'
                ]
            ], 401);
        }
    }
}
