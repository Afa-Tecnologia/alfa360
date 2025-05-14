<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class JwtMiddleware
{
    /**
     * Handle an incoming request, checking for valid JWT token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Get token from cookie, then from header if cookie isn't present
            $token = $this->getTokenFromRequest($request);
            
            if (!$token) {
                return response()->json(['message' => 'Token de autenticação não encontrado'], 401);
            }
            
            // Set the token for JWTAuth to validate
            JWTAuth::setToken($token);
            
            // Verify the token and authenticate user
            $user = JWTAuth::authenticate();
            
            if (!$user) {
                return response()->json(['message' => 'Usuário não encontrado'], 404);
            }
            
            // Set authenticated user in Auth facade
            Auth::login($user);
            
        } catch (TokenExpiredException $e) {
            Log::info('Token expirado', ['path' => $request->path()]);
            
            return response()->json([
                'message' => 'Token expirado',
                'code' => 'token_expired'
            ], 401);
            
        } catch (TokenInvalidException $e) {
            Log::info('Token inválido', ['path' => $request->path()]);
            
            return response()->json([
                'message' => 'Token inválido',
                'code' => 'token_invalid'
            ], 401);
            
        } catch (JWTException $e) {
            Log::warning('Erro no JWT: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erro no token de autenticação',
                'code' => 'token_error'
            ], 401);
        }
        
        return $next($request);
    }
    
    /**
     * Extract JWT token from request
     *
     * @param Request $request
     * @return string|null
     */
    protected function getTokenFromRequest(Request $request): ?string
    {
        // Try to get from cookie first (most secure method)
        $token = $request->cookie('jwt_token');
        
        // If no cookie, check Authorization header
        if (!$token) {
            $header = $request->header('Authorization');
            
            if ($header && preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
                $token = $matches[1];
            }
        }
        
        // As a last resort, check for token in request parameters (not recommended for production)
        if (!$token && config('app.env') !== 'production') {
            $token = $request->input('token');
        }
        
        return $token;
    }
} 