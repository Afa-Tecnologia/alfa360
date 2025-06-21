<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Limpa o cache do Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Lista agrupada de permissões
        $permissions = [

            // Lojas do sistema
            'lojas.gerenciar',
            'lojas.criar',
            'lojas.visualizar',
            'lojas.editar',
            'lojas.deletar',
            'lojas.integrar',

            // Assinaturas do sistema
            'assinaturas.gerenciar',
            'assinaturas.criar',
            'assinaturas.visualizar',
            'assinaturas.editar',
            'assinaturas.deletar',

            // Empresas do sistema
            'empresas.gerenciar',
            'empresas.criar',
            'empresas.visualizar',
            'empresas.editar',
            'empresas.deletar',
            'empresas.integrar',

            // Usuários
            'usuarios.gerenciar',
            'usuarios.criar',
            'usuarios.visualizar',
            'usuarios.editar',
            'usuarios.deletar',

            // Produtos
            'produtos.gerenciar',
            'produtos.criar',
            'produtos.visualizar',
            'produtos.editar',
            'produtos.deletar',

            // Categorias
            'categorias.gerenciar',
            'categorias.criar',
            'categorias.visualizar',
            'categorias.editar',
            'categorias.deletar',

            // Clientes
            'clientes.gerenciar',
            'clientes.criar',
            'clientes.visualizar',
            'clientes.editar',
            'clientes.deletar',

            // Caixas
            'caixas.gerenciar',
            'caixas.criar',
            'caixas.visualizar',
            'caixas.editar',
            'caixas.deletar',

            // Movimentos de Caixa
            'movimentos_caixa.gerenciar',
            'movimentos_caixa.visualizar',
            'movimentos_caixa.editar',
            'movimentos_caixa.deletar',
            'movimentos_caixa.entrada',
            'movimentos_caixa.saida',

            // Devoluções
            'devolucoes.gerenciar',
            'devolucoes.visualizar',
            'devolucoes.aprovar',
            'devolucoes.rejeitar',
            'devolucoes.editar',
            'devolucoes.criar',

            // Métodos de pagamento
            'metodos_pagamento.gerenciar',
            'metodos_pagamento.criar',
            'metodos_pagamento.visualizar',
            'metodos_pagamento.editar',
            'metodos_pagamento.deletar',

            // Pagamentos
            'pagamentos.gerenciar',
            'pagamentos.visualizar',
            'pagamentos.editar',
            'pagamentos.deletar',
            'pagamentos.criar',

            // Pedidos
            'pedidos.gerenciar',
            'pedidos.criar',
            'pedidos.visualizar',
            'pedidos.editar',
            'pedidos.deletar',

            // Relatórios
            'relatorios.visualizar',

            // Configuração
            'configuracoes.gerenciar',
            'configuracoes.criar',
            'configuracoes.editar',
            'configuracoes.deletar',
        ];

        // Criação de permissões
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Criação de perfis (roles)
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $admin      = Role::firstOrCreate(['name' => 'admin']);
        $gerente    = Role::firstOrCreate(['name' => 'gerente']);
        $vendedor   = Role::firstOrCreate(['name' => 'vendedor']);

        // SUPER ADMIN – tem todas as permissões
        $superAdmin->syncPermissions(Permission::all());

        // ADMIN – controle geral da loja
        $admin->syncPermissions([
            // Usuários
            'usuarios.gerenciar',
            'usuarios.criar',
            'usuarios.visualizar',
            'usuarios.editar',
            'usuarios.deletar',

            // Produtos
            'produtos.gerenciar',
            'produtos.criar',
            'produtos.visualizar',
            'produtos.editar',
            'produtos.deletar',

            // Categorias
            'categorias.gerenciar',
            'categorias.criar',
            'categorias.visualizar',
            'categorias.editar',
            'categorias.deletar',

            // Clientes
            'clientes.gerenciar',
            'clientes.criar',
            'clientes.visualizar',
            'clientes.editar',
            'clientes.deletar',

            // Caixas
            'caixas.gerenciar',
            'caixas.criar',
            'caixas.visualizar',
            'caixas.editar',
            'caixas.deletar',

            // Movimentos de caixa
            'movimentos_caixa.gerenciar',
            'movimentos_caixa.visualizar',
            'movimentos_caixa.editar',
            'movimentos_caixa.deletar',
            'movimentos_caixa.entrada',
            'movimentos_caixa.saida',

            // Devoluções
            'devolucoes.gerenciar',
            'devolucoes.visualizar',
            'devolucoes.aprovar',
            'devolucoes.rejeitar',
            'devolucoes.editar',
            'devolucoes.criar',

            // Métodos de pagamento
            'metodos_pagamento.gerenciar',
            'metodos_pagamento.criar',
            'metodos_pagamento.visualizar',
            'metodos_pagamento.editar',
            'metodos_pagamento.deletar',

            // Pagamentos
            'pagamentos.gerenciar',
            'pagamentos.visualizar',
            'pagamentos.editar',
            'pagamentos.deletar',
            'pagamentos.criar',

            // Pedidos
            'pedidos.gerenciar',
            'pedidos.criar',
            'pedidos.visualizar',
            'pedidos.editar',
            'pedidos.deletar',

            // Relatórios
            'relatorios.visualizar',

            // Configurações
            'configuracoes.gerenciar',
            'configuracoes.criar',
            'configuracoes.editar',
            'configuracoes.deletar',
        ]);

        // GERENTE – gerencia operações do dia a dia
        $gerente->syncPermissions([
            'produtos.gerenciar',
            'produtos.criar',
            'produtos.visualizar',
            'produtos.editar',

            'categorias.gerenciar',
            'categorias.criar',
            'categorias.visualizar',
            'categorias.editar',

            'clientes.gerenciar',
            'clientes.criar',
            'clientes.visualizar',
            'clientes.editar',

            'metodos_pagamento.gerenciar',
            'metodos_pagamento.criar',
            'metodos_pagamento.visualizar',
            'metodos_pagamento.editar',

            'pagamentos.gerenciar',
            'pagamentos.visualizar',
            'pagamentos.editar',
            'pagamentos.criar',

            'pedidos.gerenciar',
            'pedidos.criar',
            'pedidos.visualizar',
            'pedidos.editar',

            'configuracoes.gerenciar',
            'configuracoes.criar',
            'configuracoes.editar',
        ]);

        // VENDEDOR – operações básicas de vendas
        $vendedor->syncPermissions([
            'produtos.visualizar',
            'pedidos.criar',
            'devolucoes.criar',
        ]);
    }
}
