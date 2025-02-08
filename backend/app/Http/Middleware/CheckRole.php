<?php

namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        // Verifica se o usuário tem algum dos papéis permitidos
        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        return $next($request);
    }
}
