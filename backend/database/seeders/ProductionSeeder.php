<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Produto;
use App\Models\Variantes;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Helpers\TenantContext;
use App\Models\Tenant;
use App\Models\Plano;
use App\Models\Empresa;
use Spatie\Permission\Models\Role;

class ProductionSeeder extends Seeder
{
        /**
         * Run the database seeds específicos para ambiente de produção.
         * Este seeder NÃO usa Faker e contém apenas dados essenciais.
         */

         
    
        public function run(): void
        {
            $this->call([
                RolesAndPermissionsSeeder::class,
            ]);

            $owner = User::updateOrCreate(
            ['email' => 'admin3@alfatecnologiabrasil.com.br'],
            [
                'name' => 'Owner Alfa',
                'password' => Hash::make('Rp8Q0dJNLN3vjf8O2Mv'),
                'uuid' => Str::uuid(), // Gerando UUID para o usuário
                'tenant_id' => Str::uuid(), // Gerando UUID para tenant_id
            ]
        );

            $owner->assignRole('super_admin'); // Atribuindo a role de owner
            
            $plano = Plano::updateOrCreate(
            ['slug' => Str::slug('Plano Básico')],
            [
                'nome' => 'Plano Básico',
                'descricao' => 'Plano básico para pequenas empresas',
                'preco' => 99.90,
                'frequencia' => 'mensal',
                'ativo' => true,
            ]
        );

        // Crie a empresa sem definir ainda o owner_id
        $empresa = Empresa::updateOrCreate(
            ['cnpj' => '12.345.678/0001-99'],
            [
                'nome' => 'Alfa Tecnologia Brasil',
                'email' => 'admin3@alfatecnologiabrasil.com.br',
                'telefone' => '(11) 1234-5678',
                'endereco' => 'Rua Exemplo, 123',
                'razao_social' => 'Alfa Tecnologia Brasil LTDA',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234-567',
                'logo' => 'https://example.com/logo.png',
                'dominio' => 'alfatecnologiabrasil.com.br',
                'slug' => Str::slug('Alfa Tecnologia Brasil'),
                'ativo' => true,
                'trial_expira_em' => now()->addDays(30),
                'assinatura_expira_em' => now()->addYear(),
                'plano_id' => $plano->id,
                'owner_id' => $owner->id, // Inicialmente sem owner_id
            ]
        );

        // Agora crie o tenant, com o ID da empresa já salvo
        $tenant = Tenant::updateOrCreate(
            ['subdominio' => 'alfatecnologiabrasil'],
            [
                'nome' => 'Alfa Tecnologia Brasil',
                'subdominio' => 'alfatecnologiabrasil',
                'empresa_id' => $empresa->id,
                'active' => true,
                'assinatura_expira_em' => now()->addYear(),
                'tenant_id' => Str::uuid(),
            ]
        );

        $tenantDois = Tenant::updateOrCreate(
            ['subdominio' => 'alfatecnologiabrasil2'],
            [
                'nome' => 'Alfa Tecnologia Brasil 2',
                'subdominio' => 'alfatecnologiabrasil2',
                'empresa_id' => $empresa->id,
                'active' => true,
                'assinatura_expira_em' => now()->addYear(),
                'tenant_id' => Str::uuid(),
            ]
        );

        $tenantUm = $tenant->id;
        TenantContext::setTenantId($tenantUm);// Definindo o tenant_id para o ambiente de produção
        $tenantDois = $tenantDois->id;

        // Seeders básicos do sistema
        $this->call([
            TipoDeNegociosSeeder::class,
            TiposDeProdutosSeeder::class,
            ConfigDoNegocioSeeder::class,
            RolesAndPermissionsSeeder::class,
        ]);

        // Criação de usuários essenciais para o sistema
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@alfatecnologiabrasil.com.br',
                'password' => 'Rp8Q0dJNLN3vjf8O2Mv',
                'uuid' => Str::uuid(), // Gerando UUID para o usuário
                'tenant_id' => $tenantUm, // Gerando UUID para tenant_id
            ],
            [
                'name' => 'Admin2',
                'email' => 'admin2@alfatecnologiabrasil.com.br',
                'password' => 'Rp8Q0dJNLN3vjf8O2Mv',
                'uuid' => Str::uuid(), // Gerando UUID para o usuário
                'tenant_id' => $tenantDois,
            ]
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            // Atribuindo a role de admin para cada usuário criado
            $user->assignRole('admin');
        }

        // Categoria básica
        $categoria = Categoria::updateOrCreate(
            ['name' => 'Produtos Gerais'],
            [
                'name' => 'Produtos Gerais',
                'description' => 'Categoria padrão para todos os produtos',
                'active' => true,
                'tenant_id' => $tenantUm, // Definindo tenant_id para o ambiente de produção
            ]
        );

        // Produto de exemplo
        $produto = Produto::updateOrCreate(
            ['name' => 'Produto Padrão'],
            [
                "name" => "Produto Padrão",
                "description" => "Produto inicial do sistema",
                "purchase_price" => 50,
                "selling_price" => 100,
                "quantity" => 10,
                "categoria_id" => $categoria->id,
                "tipo_de_produto_id" => 1,
                "brand" => "Marca Padrão",
                "code" => 1001,
                "tenant_id" => $tenantUm, // Definindo tenant_id para o ambiente de produção
            ]
        );

        // Variante do produto
        Variantes::updateOrCreate(
            ['name' => 'PRODUTO PADRÃO M'],
            [
                "produto_id" => $produto->id,
                "name" => "PRODUTO PADRÃO M",
                "color" => "PRETO",
                "type" => "default",
                "size" => "M",
                "quantity" => 10,
                "active" => true,
                "tenant_id" => $tenantUm, // Definindo tenant_id para o ambiente de produção
            ]
        );

        // Cliente de exemplo
        Cliente::updateOrCreate(
            ['email' => 'cliente@exemplo.com'],
            [
                "name" => "Cliente",
                "last_name" => "Padrão",
                "email" => "cliente@exemplo.com",
                "phone" => "(00) 00000-0000",
                "cpf" => "000.000.000-00",
                "adress" => "Rua Exemplo, 123",
                "city" => "Cidade",
                "state" => "UF",
                "cep" => "00000-000",
                "date_of_birth" => "2000-01-01",
                "tenant_id" => $tenantUm, // Definindo tenant_id para o ambiente de produção
            ]
        );
    }
} 