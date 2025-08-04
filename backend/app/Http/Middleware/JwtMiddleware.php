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
            // Validações de segurança para prevenir ataques
            if ($this->isMaliciousRequest($request)) {
                Log::warning('Tentativa de ataque detectada', [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'path' => $request->path(),
                    'headers' => $request->headers->all()
                ]);
                return response()->json(['message' => 'Requisição inválida'], 400);
            }

            // Get token from cookie, then from header if cookie isn't present
            $token = $this->getTokenFromRequest($request);
            
            if (!$token) {
                return response()->json(['message' => 'Token de autenticação não encontrado'], 401);
            }

            // Validação adicional do token
            if (!$this->isValidTokenFormat($token)) {
                Log::warning('Formato de token inválido detectado', [
                    'ip' => $request->ip(),
                    'token_preview' => substr($token, 0, 20) . '...'
                ]);
                return response()->json(['message' => 'Token de autenticação inválido'], 401);
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
     * Verifica se a requisição contém padrões maliciosos
     */
    protected function isMaliciousRequest(Request $request): bool
    {
        // Verifica URLs data:// que podem conter código malicioso
        $url = $request->fullUrl();
        if (str_contains($url, 'data://')) {
            return true;
        }

        // Verifica headers suspeitos
        $headers = $request->headers->all();
        foreach ($headers as $name => $values) {
            $headerValue = is_array($values) ? implode(' ', $values) : $values;
            
            // Verifica por padrões de injeção de código mais críticos
            $maliciousPatterns = [
                'data://',
                'php://',
                '<?php',
                'system(',
                'exec(',
                'shell_exec(',
                'passthru(',
                'eval(',
                'base64_decode('
            ];

            foreach ($maliciousPatterns as $pattern) {
                if (stripos($headerValue, $pattern) !== false) {
                    return true;
                }
            }
        }

        // Verifica parâmetros da URL
        $queryParams = $request->query();
        foreach ($queryParams as $key => $value) {
            if (is_string($value)) {
                foreach (['data://', 'php://', '<?php', 'system(', 'eval('] as $pattern) {
                    if (stripos($value, $pattern) !== false) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Valida o formato básico do token JWT
     */
    protected function isValidTokenFormat(string $token): bool
    {
        // Verifica se o token não contém caracteres suspeitos
        $maliciousPatterns = [
            'data://',
            'php://',
            '<?php',
            'system(',
            'eval(',
            'base64_decode('
        ];

        foreach ($maliciousPatterns as $pattern) {
            if (stripos($token, $pattern) !== false) {
                return false;
            }
        }

        // Verifica se o token tem formato básico de JWT (3 partes separadas por ponto)
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        // Verifica se cada parte contém apenas caracteres válidos para base64
        foreach ($parts as $part) {
            if (!preg_match('/^[A-Za-z0-9+\/]+={0,2}$/', $part)) {
                return false;
            }
        }

        return true;
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