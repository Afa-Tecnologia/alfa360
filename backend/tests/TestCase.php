<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Config;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();
        // Forçar TTL do JWT a ser numérico durante os testes para evitar erros no Carbon
        Config::set('jwt.ttl', 120);
        try {
            JWTAuth::factory()->setTTL(120);
        } catch (\Throwable $e) {
            // Ignorar se o JWTAuth não estiver disponível neste contexto
        }
    }

    /**
     * Setup roles and permissions for tests
     */
    protected function setupRolesAndPermissions()
    {
        // Limpa o cache do Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Criar permissões básicas para testes
        $permissions = [
            'produtos.gerenciar',
            'produtos.criar',
            'produtos.visualizar',
            'produtos.editar',
            'produtos.deletar',
            'pedidos.gerenciar',
            'pedidos.criar',
            'pedidos.visualizar',
            'pedidos.editar',
            'pedidos.deletar',
            'clientes.gerenciar',
            'clientes.criar',
            'clientes.visualizar',
            'clientes.editar',
            'clientes.deletar',
            'caixas.gerenciar',
            'caixas.criar',
            'caixas.visualizar',
            'caixas.editar',
            'caixas.deletar',
        ];

        // Criar permissões
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'api'
            ]);
        }

        // Criar roles
        $admin = Role::firstOrCreate(['guard_name' => 'api', 'name' => 'admin']);
        $vendedor = Role::firstOrCreate(['guard_name' => 'api', 'name' => 'vendedor']);

        // Atribuir permissões aos roles
        $admin->syncPermissions(Permission::all());
        $vendedor->syncPermissions([
            'produtos.visualizar',
            'pedidos.criar',
            'clientes.visualizar',
            'caixas.visualizar',
        ]);
    }
}
