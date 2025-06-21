<?php


namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\JsonResponse;

class UserAuthController extends Controller
{
    /**
     * Cadastra um novo usuário
     */
    public function signup(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8|confirmed'
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'perfil' => $data['perfil'] ?? 'vendedor', // Define perfil padrão se não fornecido
            ]);

            Log::info('Novo usuário registrado', ['id' => $user->id, 'ip' => $request->ip()]);

            return response()->json([
                'message' => 'Cadastro realizado com sucesso',
                'user' => $user->only(['id', 'name', 'email'])
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Erro no signup: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao processar solicitação'], 500);
        }
    }

    /**
     * Autentica o usuário e gera tokens JWT
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string|min:8'
            ]);

            if (!Auth::guard('api')->attempt($credentials)) {
                return response()->json(['message' => 'Credenciais inválidas'], 401);
            }

            $user = Auth::guard('api')->user();

            $accessToken = JWTAuth::fromUser($user);
            $refreshToken = JWTAuth::customClaims([
                'exp' => now()->addDays(7)->timestamp,
                'token_type' => 'refresh'
            ])->fromUser($user);

            Log::info('Login bem-sucedido', [
                'user_id' => $user->id,
                'ip' => $request->ip(),
                'agent' => $request->userAgent()
            ]);

            // // Obtenha o domínio da solicitação atual
            // $domain = $request->getHost();
            // // Se for localhost, use null (comportamento padrão)
            // $cookieDomain = str_contains($domain, 'localhost') ? null : '.'.$this->extractRootDomain($domain);
            $cookieDomain = app()->environment('local') ? null : 'alfa360.alfatecnologia.tech';


            return response()->json([
                'message' => 'Login realizado com sucesso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'perfil' => $user->perfil,
                    'tenant_id' => $user->tenant_id
                ],
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60
            ])
            ->cookie('jwt_token', $accessToken, 90, '/', $cookieDomain, true, true, false, 'None')
            ->cookie('jwt_refresh_token', $refreshToken, 10080, '/', $cookieDomain, true, true, false, 'None');

        } catch (ValidationException $e) {
            return response()->json(['message' => 'Erro de validação', 'errors' => $e->errors()], 422);
        } catch (\Throwable $e) {
            Log::error('Erro no login: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao processar login'], 500);
        }
    }

    /**
     * Invalida os tokens JWT e remove cookies
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $token = $request->cookie('jwt_token') ??
                     $this->extractTokenFromHeader($request->header('Authorization'));

            if ($token) {
                JWTAuth::setToken($token)->invalidate();
            }

            Auth::guard('api')->logout();

            $cookieDomain = app()->environment('local') ? null : 'alfa360.alfatecnologia.tech';

            return response()->json(['message' => 'Logout realizado com sucesso'])
                ->withCookie(cookie('jwt_token', null, -1, '/', $cookieDomain, true, true, false, 'None'))
                ->withCookie(cookie('jwt_refresh_token', null, -1, '/', $cookieDomain, true, true, false, 'None'));

        } catch (JWTException $e) {
            Log::warning('Erro ao invalidar token: ' . $e->getMessage());
            return response()->json(['message' => 'Logout forçado, token inválido ou expirado'])
                ->withCookie(cookie()->forget('jwt_token'))
                ->withCookie(cookie()->forget('jwt_refresh_token'));
        } catch (\Throwable $e) {
            Log::error('Erro no logout: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao processar logout'], 500);
        }
    }

   
/**
 * Gera novos tokens a partir do refresh token
 */
public function refresh(Request $request): JsonResponse
{
    $refreshToken = $request->cookie('jwt_refresh_token') ?? $request->input('refresh_token');

    if (!$refreshToken) {
        return response()->json(['message' => 'Token de atualização não fornecido'], 401);
    }

    try {
        // Define o token como refresh token
        JWTAuth::setToken($refreshToken);
        
        // Tenta decodificar o payload sem verificar expiração primeiro
        $payload = JWTAuth::payload($refreshToken);
        
        // Verifica se é um refresh token válido
        if ($payload->get('token_type') !== 'refresh') {
            $this->limparCookies($request);
            Log::warning('Token fornecido não é um refresh token válido');
            return response()->json(['message' => 'Token de atualização inválido'], 401);
        }

        // Verifica se o refresh token não expirou
        if ($payload->get('exp') < now()->timestamp) {
            $this->limparCookies($request);
            Log::warning('Refresh token expirado', ['exp' => $payload->get('exp'), 'now' => now()->timestamp]);
            return response()->json(['message' => 'Token de atualização expirado'], 401);
        }

        $userId = $payload->get('sub');
        $user = User::find($userId);

        if (!$user) {
            $this->limparCookies($request);
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        // Gera novos tokens ANTES de invalidar o antigo
        $newAccessToken = JWTAuth::fromUser($user);
        $newRefreshToken = JWTAuth::customClaims([
            'exp' => now()->addDays(7)->timestamp,
            'token_type' => 'refresh'
        ])->fromUser($user);

        // invalida o token antigo
        JWTAuth::setToken($refreshToken)->invalidate();


        $cookieDomain = app()->environment('local') ? null : 'alfa360.alfatecnologia.tech';
        
        // Configurações de cookie mais compatíveis
        $isSecure = !app()->environment('local');
        $sameSite = app()->environment('local') ? 'Lax' : 'None';

        return response()->json([
            'message' => 'Token renovado com sucesso',
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            // Opcional: retornar os tokens no body também para debug
            'debug_mode' => app()->environment('local')
        ])
        ->cookie('jwt_token', $newAccessToken, 90, '/', $cookieDomain, true, true, false, 'None')
        ->cookie('jwt_refresh_token', $newRefreshToken, 10080, '/', $cookieDomain, true, true, false, 'None');

    } catch (JWTException $e) {
        return $this->limparCookies($request);
    } 
}


/**
 * Método auxiliar para verificar se um token é válido sem considerar expiração
 */
private function isTokenStructurallyValid(string $token): bool
{
    try {
        $payload = JWTAuth::payload($token);
        return $payload->get('sub') !== null;
    } catch (\Exception $e) {
        return false;
    }
}

    /**
     * Retorna o usuário autenticado
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = Auth::guard('api')->user();

            if (!$user) {
                return response()->json(['message' => 'Usuário não autenticado'], 401);
            }

            return response()->json(['user' => $user->only(['id', 'name', 'email', 'role', 'perfil', 'tenant_id'])]);

        } catch (\Throwable $e) {
            Log::error('Erro ao buscar usuário: ' . $e->getMessage());
            return response()->json(['message' => 'Erro interno ao buscar usuário'], 500);
        }
    }

    /**
     * Extrai o token do header Authorization
     */
    private function extractTokenFromHeader(?string $header): ?string
    {
        if (!$header || !str_starts_with($header, 'Bearer ')) return null;
        return substr($header, 7);
    }

    /**
     * Extrai o domínio raiz da URL
     */
    private function extractRootDomain(string $host): string
    {
        $hostParts = explode('.', $host);
        $count = count($hostParts);
        
        // Para domínios simples como 'example.com'
        if ($count <= 2) {
            return $host;
        }
        
        // Para subdomínios como 'tenant.alfa360.alfatecnologia.tech'
        return implode('.', array_slice($hostParts, -2));
    }

    private function limparCookies(Request $request): JsonResponse
    {
        $cookieDomain = app()->environment('local') ? null : 'alfa360.alfatecnologia.tech';

        return response()->json(['message' => 'Falha ao renovar Token: Token de atualização expirado ou inválido'])
            ->withCookie(cookie('jwt_token', null, -1, '/', $cookieDomain, true, true, false, 'None'))
            ->withCookie(cookie('jwt_refresh_token', null, -1, '/', $cookieDomain, true, true, false, 'None'));
    }
}
