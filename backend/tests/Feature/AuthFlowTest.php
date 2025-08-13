<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Garante que o TTL do JWT é numérico em minutos durante os testes
        Config::set('jwt.ttl', 120); // 2 horas
        // Força o factory do JWT a usar TTL numérico para evitar Carbon errors
        JWTAuth::factory()->setTTL(120);
    }

    private function createActiveTenant(): Tenant
    {
        return Tenant::create([
            'nome' => 'Tenant Teste',
            'subdominio' => 'tenant-' . Str::random(6),
            'active' => true,
            'plano_id' => null,
            'assinatura_expira_em' => now()->addMonth(),
        ]);
    }

    private function createUserForTenant(Tenant $tenant, array $overrides = []): User
    {
        /** @var User $user */
        $user = User::factory()->create(array_merge([
            'tenant_id' => $tenant->id,
            // Hash explícito para garantir compatibilidade com o guard JWT
            'password' => bcrypt('password'),
        ], $overrides));

        return $user;
    }

    public function test_login_success_sets_jwt_cookie_and_allows_me_endpoint(): void
    {
        $tenant = $this->createActiveTenant();
        $user = $this->createUserForTenant($tenant, [
            'email' => 'user@example.com',
        ]);

        // Login
        $response = $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'user' => ['id', 'name', 'email'],
                     'token_type',
                     'expires_in',
                 ]);

        // Extrai o token do cookie 'jwt_token'
        $cookies = $response->headers->getCookies();
        $jwtCookieValue = null;
        foreach ($cookies as $cookie) {
            if ($cookie->getName() === 'jwt_token') {
                $jwtCookieValue = $cookie->getValue();
                break;
            }
        }

        $this->assertNotEmpty($jwtCookieValue, 'Cookie jwt_token não foi definido no login.');

        // Acessa /api/me autenticado via Authorization: Bearer
        $me = $this->withHeaders([
            'Authorization' => 'Bearer ' . $jwtCookieValue,
        ])->getJson('/api/me');

        $me->assertStatus(200)
           ->assertJsonStructure([
               'user' => ['id', 'name', 'email'],
           ]);
    }

    public function test_login_failure_returns_401(): void
    {
        $tenant = $this->createActiveTenant();
        $user = $this->createUserForTenant($tenant, [
            'email' => 'user2@example.com',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'user2@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401);
    }

    public function test_me_requires_authentication(): void
    {
        $response = $this->getJson('/api/me');
        $response->assertStatus(401);
    }

    public function test_logout_invalidates_token(): void
    {
        $tenant = $this->createActiveTenant();
        $user = $this->createUserForTenant($tenant, [
            'email' => 'user3@example.com',
        ]);

        // Gera token diretamente para isolar o cenário de logout
        $jwtCookieValue = JWTAuth::fromUser($user);

        // Faz logout enviando tanto o cookie quanto o header (maior compatibilidade)
        $logout = $this->withCookie('jwt_token', $jwtCookieValue)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $jwtCookieValue,
            ])->postJson('/api/logout');

        $logout->assertStatus(200);

        // Tenta acessar /me com o mesmo token deve falhar (401)
        $meAfterLogout = $this->withHeaders([
            'Authorization' => 'Bearer ' . $jwtCookieValue,
        ])->getJson('/api/me');

        $meAfterLogout->assertStatus(401);
    }

    public function test_expired_token_returns_401_on_protected_route(): void
    {
        $tenant = $this->createActiveTenant();
        $user = $this->createUserForTenant($tenant, [
            'email' => 'user4@example.com',
        ]);

        $token = JWTAuth::fromUser($user);

        // Avança o tempo para além do TTL padrão, simulando expiração
        $originalNow = Carbon::now();
        Carbon::setTestNow($originalNow->copy()->addHours(3));

        try {
            $resp = $this->withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->getJson('/api/me');

            $resp->assertStatus(401);
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_logout_with_expired_token_still_returns_200(): void
    {
        $tenant = $this->createActiveTenant();
        $user = $this->createUserForTenant($tenant, [
            'email' => 'user5@example.com',
        ]);

        $token = JWTAuth::fromUser($user);

        // Simula expiração do token
        $originalNow = Carbon::now();
        Carbon::setTestNow($originalNow->copy()->addHours(3));

        try {
            // A rota de logout deve responder 200 mesmo com token inválido/expirado
            $logout = $this->withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->postJson('/api/logout');

            $logout->assertStatus(200);
        } finally {
            Carbon::setTestNow();
        }
    }
}

