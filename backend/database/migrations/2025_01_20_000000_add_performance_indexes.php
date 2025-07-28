<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Índices para tabela produtos (queries de busca e filtros)
        Schema::table('produtos', function (Blueprint $table) {
            // Índices para busca por texto (name, code, brand)
            $table->index('name');
            $table->index('code');
            $table->index('brand');
            
            // Índice composto para busca eficiente
            $table->index(['name', 'code', 'brand'], 'produtos_search_index');
            
            // Índice para filtro por categoria
            $table->index('categoria_id');
            
            // Índice para ordenação por preço
            $table->index('selling_price');
            
            // Índice para estoque
            $table->index('quantity');
            
            // Índice para tenant (multitenancy)
            $table->index('tenant_id');
            
            // Índice composto para queries de listagem
            $table->index(['categoria_id', 'active'], 'produtos_categoria_active');
        });

        // Índices para tabela variantes (queries de busca e relacionamentos)
        Schema::table('variantes', function (Blueprint $table) {
            // Índices para busca por texto
            $table->index('name');
            $table->index('code');
            
            // Índice para produto_id (relacionamento)
            $table->index('produto_id');
            
            // Índice para estoque
            $table->index('quantity');
            
            // Índice para status ativo
            $table->index('active');
            
            // Índice composto para queries de estoque
            $table->index(['produto_id', 'active'], 'variantes_produto_active');
            
            // Índice composto para busca eficiente
            $table->index(['name', 'code'], 'variantes_search_index');
            
            // Índice para tenant
            $table->index('tenant_id');
        });

        // Índices para tabela variantes_atributos (pivot table)
        Schema::table('variantes_atributos', function (Blueprint $table) {
            // Índices para relacionamentos
            $table->index('variante_id');
            $table->index('atributo_id');
            
            // Índice composto para queries de atributos
            $table->index(['variante_id', 'atributo_id'], 'variante_atributo_unique');
        });

        // Índices para tabela pedidos (queries de relatórios e filtros)
        Schema::table('pedidos', function (Blueprint $table) {
            // Índices para status e tipo
            $table->index('status');
            $table->index('type');
            
            // Índice para cliente
            $table->index('cliente_id');
            
            // Índice para total (relatórios)
            $table->index('total');
            
            // Índice para data de criação
            $table->index('created_at');
            
            // Índice composto para relatórios
            $table->index(['status', 'created_at'], 'pedidos_status_date');
            $table->index(['type', 'created_at'], 'pedidos_type_date');
            
            // Índice para tenant
            $table->index('tenant_id');
        });

        // Índices para tabela pedidos_produtos (queries de relacionamento)
        Schema::table('pedidos_produtos', function (Blueprint $table) {
            // Índices para relacionamentos
            $table->index('pedido_id');
            $table->index('produto_id');
            $table->index('vendedor_id');
            
            // Índice composto para queries de pedido
            $table->index(['pedido_id', 'produto_id'], 'pedido_produto_unique');
        });

        // Índices para tabela clientes (queries de busca)
        Schema::table('clientes', function (Blueprint $table) {
            // Índices para busca
            $table->index('name');
            $table->index('email');
            $table->index('cpf');
            $table->index('phone');
            
            // Índice composto para busca por nome
            $table->index(['name', 'last_name'], 'clientes_name_search');
            
            // Índice para tenant
            $table->index('tenant_id');
        });

        // Índices para tabela categorias (queries de filtro)
        Schema::table('categorias', function (Blueprint $table) {
            // Índices para busca
            $table->index('name');
            $table->index('active');
            
            // Índice composto
            $table->index(['name', 'active'], 'categorias_name_active');
            
            // Índice para tenant
            $table->index('tenant_id');
        });

        // Índices para tabela commissions (relatórios de comissão)
        Schema::table('commissions', function (Blueprint $table) {
            // Índices para relatórios
            $table->index('vendedor_id');
            $table->index('status');
            $table->index('created_at');
            
            // Índice composto para relatórios por vendedor
            $table->index(['vendedor_id', 'status'], 'commissions_vendedor_status');
            
            // Índice para tenant
            $table->index('tenant_id');
        });

        // Índices para tabela users (queries de autenticação)
        Schema::table('users', function (Blueprint $table) {
            // Índices para busca
            $table->index('name');
            $table->index('email');
            
            // Índice para tenant
            $table->index('tenant_id');
        });

        // Índices para tabela atributos (queries de filtro)
        Schema::table('atributos', function (Blueprint $table) {
            // Índice para busca
            $table->index('name');
            
            // Índice para tenant
            $table->index('tenant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remover índices da tabela produtos
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['code']);
            $table->dropIndex(['brand']);
            $table->dropIndex('produtos_search_index');
            $table->dropIndex(['categoria_id']);
            $table->dropIndex(['selling_price']);
            $table->dropIndex(['quantity']);
            $table->dropIndex(['tenant_id']);
            $table->dropIndex('produtos_categoria_active');
        });

        // Remover índices da tabela variantes
        Schema::table('variantes', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['code']);
            $table->dropIndex(['produto_id']);
            $table->dropIndex(['quantity']);
            $table->dropIndex(['active']);
            $table->dropIndex('variantes_produto_active');
            $table->dropIndex('variantes_search_index');
            $table->dropIndex(['tenant_id']);
        });

        // Remover índices da tabela variantes_atributos
        Schema::table('variantes_atributos', function (Blueprint $table) {
            $table->dropIndex(['variante_id']);
            $table->dropIndex(['atributo_id']);
            $table->dropIndex('variante_atributo_unique');
        });

        // Remover índices da tabela pedidos
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['type']);
            $table->dropIndex(['cliente_id']);
            $table->dropIndex(['total']);
            $table->dropIndex(['created_at']);
            $table->dropIndex('pedidos_status_date');
            $table->dropIndex('pedidos_type_date');
            $table->dropIndex(['tenant_id']);
        });

        // Remover índices da tabela pedidos_produtos
        Schema::table('pedidos_produtos', function (Blueprint $table) {
            $table->dropIndex(['pedido_id']);
            $table->dropIndex(['produto_id']);
            $table->dropIndex(['vendedor_id']);
            $table->dropIndex('pedido_produto_unique');
        });

        // Remover índices da tabela clientes
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['email']);
            $table->dropIndex(['cpf']);
            $table->dropIndex(['phone']);
            $table->dropIndex('clientes_name_search');
            $table->dropIndex(['tenant_id']);
        });

        // Remover índices da tabela categorias
        Schema::table('categorias', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['active']);
            $table->dropIndex('categorias_name_active');
            $table->dropIndex(['tenant_id']);
        });

        // Remover índices da tabela commissions
        Schema::table('commissions', function (Blueprint $table) {
            $table->dropIndex(['vendedor_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
            $table->dropIndex('commissions_vendedor_status');
            $table->dropIndex(['tenant_id']);
        });

        // Remover índices da tabela users
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['email']);
            $table->dropIndex(['tenant_id']);
        });

        // Remover índices da tabela atributos
        Schema::table('atributos', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['tenant_id']);
        });
    }
}; 