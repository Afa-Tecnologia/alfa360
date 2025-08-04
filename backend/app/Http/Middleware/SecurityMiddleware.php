<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SecurityMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Verifica se a requisição contém padrões maliciosos
        if ($this->isMaliciousRequest($request)) {
            Log::warning('Tentativa de ataque detectada pelo SecurityMiddleware', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'path' => $request->path(),
                'method' => $request->method(),
                'url' => $request->fullUrl()
            ]);

            return response()->json([
                'message' => 'Requisição inválida detectada',
                'error' => 'security_violation'
            ], 400);
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
                'base64_decode(',
                'include(',
                'require('
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
} 