# Implementação de Medidas de Segurança - AlfaManager

Este documento apresenta o passo a passo para implementar melhorias de segurança identificadas no sistema AlfaManager.

## Sumário

1. [Melhorias no Backend](#melhorias-no-backend)
2. [Melhorias no Frontend](#melhorias-no-frontend)
3. [Testes de Segurança](#testes-de-segurança)

## Melhorias no Backend

### 1. Implementar Política de Senhas Forte

Edite o arquivo `backend/app/Http/Controllers/Auth/UserAuthController.php`:

```php
public function signup(Request $request)
{
    $registerUserData = $request->validate([
        'name' => 'required|string',
        'email' => 'required|string|email|unique:users,email',
        'password' => [
            'required',
            'string',
            'min:8',
            'regex:/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&]).*$/',
            'confirmed'
        ]
    ], [
        'password.regex' => 'A senha deve conter pelo menos 8 caracteres, incluindo letras, números e caracteres especiais.'
    ]);

    // Restante do código...
}
```

### 2. Configurar Expiração de Token

Edite o arquivo `backend/config/sanctum.php`:

```php
'expiration' => 60 * 24, // 24 horas
```

### 3. Restringir CORS para Origens Específicas

Edite o arquivo `backend/config/cors.php`:

```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'supports_credentials' => true,
```

### 4. Implementar Rate Limiting

Edite o arquivo `backend/routes/api.php`:

```php
Route::post('signup', [UserAuthController::class, 'signup'])->middleware('throttle:3,1');
Route::post('login', [UserAuthController::class, 'login'])->middleware('throttle:5,1');
```

### 5. Implementar RBAC Consistente

Crie ou atualize o middleware `CheckRole` em `backend/app/Http/Middleware/CheckRole.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['error' => 'Acesso negado'], 403);
        }

        return $next($request);
    }
}
```

Registre o middleware em `backend/app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    // Outros middlewares
    'check.role' => \App\Http\Middleware\CheckRole::class,
];
```

Aplique o middleware nas rotas:

```php
// Em backend/routes/api.php
Route::prefix('users')->middleware(['auth:sanctum', 'check.role:admin'])->group(function () {
    // Rotas de administração
});
```

### 6. Melhorar Tratamento de Erros

Edite o arquivo `backend/app/Exceptions/Handler.php`:

```php
public function render($request, Throwable $exception)
{
    if ($request->expectsJson()) {
        if ($exception instanceof ValidationException) {
            return response()->json([
                'message' => 'Os dados fornecidos são inválidos.',
                'errors' => $exception->errors(),
            ], 422);
        }

        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'message' => 'Não autenticado.',
            ], 401);
        }

        if ($exception instanceof AuthorizationException) {
            return response()->json([
                'message' => 'Ação não autorizada.',
            ], 403);
        }

        // Não expor detalhes internos em produção
        if (app()->environment('production')) {
            return response()->json([
                'message' => 'Ocorreu um erro no servidor.',
            ], 500);
        }
    }

    return parent::render($request, $exception);
}
```

### 7. Implementar Logs de Auditoria

Crie um middleware em `backend/app/Http/Middleware/AuditLog.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AuditLog
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $user = Auth::user();
        $userId = $user ? $user->id : 'unauthenticated';

        // Registrar apenas ações sensíveis (POST, PUT, DELETE)
        if (in_array($request->method(), ['POST', 'PUT', 'DELETE', 'PATCH'])) {
            Log::channel('audit')->info('Ação realizada', [
                'user_id' => $userId,
                'method' => $request->method(),
                'endpoint' => $request->fullUrl(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status_code' => $response->getStatusCode()
            ]);
        }

        return $response;
    }
}
```

Configure um canal de log em `backend/config/logging.php`:

```php
'channels' => [
    // Outros canais...
    'audit' => [
        'driver' => 'daily',
        'path' => storage_path('logs/audit.log'),
        'level' => 'info',
        'days' => 30,
    ],
],
```

### 8. Usar Cookies HttpOnly para Tokens

Edite o arquivo `backend/config/sanctum.php`:

```php
'middleware' => [
    'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    'encrypt_cookies' => \Illuminate\Cookie\Middleware\EncryptCookies::class,
],
```

## Melhorias no Frontend

### 1. Usar HttpOnly Cookies para Tokens

Atualize o arquivo `frontend/app/api/api.ts`:

```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Importante para enviar cookies
});

// Remover o uso de token no interceptor
api.interceptors.request.use(
  (config) => {
    // Não precisamos mais adicionar o token manualmente
    // pois ele virá como cookie HttpOnly
    return config;
  },
  (error) => Promise.reject(error),
);
```

### 2. Implementar CSRF Protection

Atualize o arquivo `frontend/app/api/api.ts`:

```typescript
import axios from "axios";

// Primeiro solicitar um cookie CSRF antes de fazer requisições
const getCsrfToken = async () => {
  await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  // Se for uma requisição não-GET, obter o token CSRF
  if (
    ["post", "put", "delete", "patch"].includes(
      config.method?.toLowerCase() || "",
    )
  ) {
    await getCsrfToken();
    // O Laravel automaticamente adiciona o token XSRF aos cookies
    // O Axios verificará o cookie e adicionará o header X-XSRF-TOKEN
  }
  return config;
});
```

### 3. Implementar Sanitização de Dados

Instale a biblioteca DOMPurify:

```bash
cd frontend
npm install dompurify @types/dompurify
```

Criar um utilitário em `frontend/utils/sanitize.ts`:

```typescript
import DOMPurify from "dompurify";

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};
```

Use esta função ao exibir conteúdo dinâmico nos componentes:

```tsx
import { sanitizeHtml } from "@/utils/sanitize";

// Em componente React
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }} />;
```

### 4. Adicionar Cabeçalhos de Segurança

Edite o arquivo `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 5. Implementar Refresh Tokens

Adicione um utilitário para refresh token em `frontend/utils/refreshToken.ts`:

```typescript
import { api } from "@/app/api/api";
import useAuthStore from "@/stores/authStore";

export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await api.post("/auth/refresh");
    if (response.data && response.data.access_token) {
      useAuthStore.getState().setToken(response.data.access_token);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Falha ao renovar o token", error);
    useAuthStore.getState().deleteAuthStorage();
    return false;
  }
};
```

## Testes de Segurança

Após implementar estas medidas, realize os seguintes testes:

1. **Teste de autenticação**:

   - Tente fazer login com credenciais inválidas
   - Verifique se o sistema bloqueia após múltiplas tentativas (rate limiting)
   - Teste a criação de senha com a nova política

2. **Teste de CORS**:
   - Tente acessar a API de um domínio não autorizado
3. **Teste de autorização**:

   - Tente acessar rotas protegidas sem autenticação
   - Tente acessar rotas administrativas com usuário comum

4. **Teste de XSS**:

   - Tente inserir scripts maliciosos em campos de entrada

5. **Teste de CSRF**:

   - Tente enviar requisições sem o token CSRF

6. **Teste de expiração de token**:
   - Verifique se o token expira após o tempo configurado
   - Verifique se o refresh token funciona corretamente
