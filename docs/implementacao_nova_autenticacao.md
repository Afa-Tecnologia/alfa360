# Implementação de Autenticação Segura com Cookies HttpOnly

Este guia apresenta um passo a passo completo para implementar autenticação segura entre uma API Laravel e um frontend Next.js 15, utilizando cookies HttpOnly e seguindo princípios SOLID e Clean Code.

## Sumário

1. [Configuração do Backend (Laravel)](#configuração-do-backend-laravel)
2. [Configuração do Frontend (Next.js)](#configuração-do-frontend-nextjs)
3. [Adaptação de Componentes Existentes](#adaptação-de-componentes-existentes)
4. [Testes e Verificação](#testes-e-verificação)

## Configuração do Backend (Laravel)

### 1. Configurar Sanctum para usar cookies

Primeiro, precisamos ajustar a configuração do Sanctum para trabalhar com cookies:

**Arquivo:** `backend/config/sanctum.php`

```php
<?php

use Laravel\Sanctum\Sanctum;

return [
    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    */
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost:3000,127.0.0.1:3000,localhost,127.0.0.1',
        Sanctum::currentApplicationUrlWithPort()
    ))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    */
    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    */
    'expiration' => 60 * 24, // 24 horas

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    */
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => \Illuminate\Cookie\Middleware\EncryptCookies::class,
    ],
];
```

### 2. Configurar CORS para funcionar com cookies

**Arquivo:** `backend/config/cors.php`

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // IMPORTANTE: permite cookies cross-origin
];
```

### 3. Criar/Modificar o Controlador de Autenticação

**Arquivo:** `backend/app/Http/Controllers/Auth/UserAuthController.php`

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserAuthController extends Controller
{
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

        $user = User::create([
            'name' => $registerUserData['name'],
            'email' => $registerUserData['email'],
            'password' => Hash::make($registerUserData['password']),
        ]);

        return response()->json([
            'message' => 'Usuário criado com sucesso',
        ]);
    }

    public function login(Request $request)
    {
        $loginUserData = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|min:8'
        ]);

        $user = User::where('email', $loginUserData['email'])->first();

        if (!$user || !Hash::check($loginUserData['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas'],
            ]);
        }

        // Criar token para autenticação via cookie
        $token = $user->createToken('auth-token');

        return response()->json([
            'message' => "Logado com sucesso!",
            'user' => $user
        ])->cookie(
            'token',
            $token->plainTextToken,
            60 * 24, // 24 horas em minutos
            null,    // path
            null,    // domain
            config('app.env') !== 'local', // secure (HTTPS apenas)
            true,    // httpOnly (não acessível via JavaScript)
            false,   // raw
            'strict' // sameSite
        );
    }

    public function logout(Request $request)
    {
        // Revogar todos os tokens do usuário
        Auth::user()->tokens()->delete();

        return response()->json([
            "message" => "Deslogado com sucesso!"
        ])->cookie('token', '', -1); // Expira o cookie
    }

    public function me()
    {
        return response()->json(Auth::user());
    }

    public function refresh()
    {
        // Revoga o token atual
        Auth::user()->currentAccessToken()->delete();

        // Cria um novo token
        $token = Auth::user()->createToken('auth-token');

        return response()->json([
            'message' => 'Token renovado com sucesso'
        ])->cookie(
            'token',
            $token->plainTextToken,
            60 * 24,
            null,
            null,
            config('app.env') !== 'local',
            true,
            false,
            'strict'
        );
    }
}
```

### 4. Atualizar Rotas da API

**Arquivo:** `backend/routes/api.php`

```php
<?php

use App\Http\Controllers\Auth\UserAuthController;
// Outros controladores importados

// Rotas públicas
Route::post('login', [UserAuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('signup', [UserAuthController::class, 'signup'])->middleware('throttle:3,1');

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [UserAuthController::class, 'logout']);
    Route::get('me', [UserAuthController::class, 'me']);
    Route::post('refresh', [UserAuthController::class, 'refresh']);

    // Outras rotas protegidas...
});
```

### 5. Preparar o Kernel HTTP para CSRF Protection

**Arquivo:** `backend/app/Http/Kernel.php`

```php
<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];
}
```

### 6. Configurar Variáveis de Ambiente

**Arquivo:** `backend/.env`

```
# Adicione estas linhas ao arquivo .env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
FRONTEND_URL=http://localhost:3000
SESSION_DOMAIN=localhost
```
