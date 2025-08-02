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
        // Índices para tabela produtos
        Schema::table('produtos', function (Blueprint $table) {
            // Índices simples (excluindo tenant_id que já existe)
            $table->index('name', 'produtos_name_index');
            $table->index('code', 'produtos_code_index');
            $table->index('brand', 'produtos_brand_index');
            $table->index('categoria_id', 'produtos_categoria_id_index');
            $table->index('selling_price', 'produtos_selling_price_index');
            $table->index('quantity', 'produtos_quantity_index');
            
            // Índices compostos
            $table->index(['name', 'code', 'brand'], 'produtos_search_index');
            $table->index(['categoria_id', 'quantity'], 'produtos_categoria_quantity');
        });

        // Índices para tabela variantes
        Schema::table('variantes', function (Blueprint $table) {
            // Índices simples (excluindo tenant_id que já existe)
            $table->index('name', 'variantes_name_index');
            $table->index('code', 'variantes_code_index');
            $table->index('produto_id', 'variantes_produto_id_index');
            $table->index('quantity', 'variantes_quantity_index');
            $table->index('active', 'variantes_active_index');
            
            // Índices compostos
            $table->index(['produto_id', 'active'], 'variantes_produto_active');
            $table->index(['name', 'code'], 'variantes_search_index');
        });

        // Índices para tabela variantes_atributos
        Schema::table('variantes_atributos', function (Blueprint $table) {
            $table->index('variante_id', 'variantes_atributos_variante_id_index');
            $table->index('atributo_id', 'variantes_atributos_atributo_id_index');
            $table->index(['variante_id', 'atributo_id'], 'variantes_atributos_composto');
        });

        // Índices para tabela pedidos
        Schema::table('pedidos', function (Blueprint $table) {
            // Índices simples (excluindo tenant_id que já existe)
            $table->index('status', 'pedidos_status_index');
            $table->index('type', 'pedidos_type_index');
            $table->index('cliente_id', 'pedidos_cliente_id_index');
            $table->index('total', 'pedidos_total_index');
            $table->index('created_at', 'pedidos_created_at_index');
            
            // Índices compostos
            $table->index(['status', 'created_at'], 'pedidos_status_date');
            $table->index(['type', 'created_at'], 'pedidos_type_date');
        });

        // Índices para tabela pedidos_produtos
        Schema::table('pedidos_produtos', function (Blueprint $table) {
            $table->index('pedido_id', 'pedidos_produtos_pedido_id_index');
            $table->index('produto_id', 'pedidos_produtos_produto_id_index');
            $table->index(['pedido_id', 'produto_id'], 'pedidos_produtos_composto');
        });

        // Índices para tabela clientes
        Schema::table('clientes', function (Blueprint $table) {
            $table->index('name', 'clientes_name_index');
            $table->index('email', 'clientes_email_index');
            $table->index('cpf', 'clientes_cpf_index');
            $table->index(['name', 'email'], 'clientes_search_index');
        });

        // Índices para tabela categorias
        Schema::table('categorias', function (Blueprint $table) {
            $table->index('name', 'categorias_name_index');
            $table->index('active', 'categorias_active_index');
        });

        // Índices para tabela commissions
        Schema::table('commissions', function (Blueprint $table) {
            $table->index('vendedor_id', 'commissions_vendedor_id_index');
            $table->index('pedido_id', 'commissions_pedido_id_index');
            $table->index('created_at', 'commissions_created_at_index');
        });

        // Índices para tabela users
        Schema::table('users', function (Blueprint $table) {
            $table->index('email', 'users_email_index');
        });

        // Índices para tabela atributos
        Schema::table('atributos', function (Blueprint $table) {
            $table->index('name', 'atributos_name_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remover índices da tabela produtos
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropIndex('produtos_name_index');
            $table->dropIndex('produtos_code_index');
            $table->dropIndex('produtos_brand_index');
            $table->dropIndex('produtos_categoria_id_index');
            $table->dropIndex('produtos_selling_price_index');
            $table->dropIndex('produtos_quantity_index');
            $table->dropIndex('produtos_search_index');
            $table->dropIndex('produtos_categoria_quantity');
        });

        // Remover índices da tabela variantes
        Schema::table('variantes', function (Blueprint $table) {
            $table->dropIndex('variantes_name_index');
            $table->dropIndex('variantes_code_index');
            $table->dropIndex('variantes_produto_id_index');
            $table->dropIndex('variantes_quantity_index');
            $table->dropIndex('variantes_active_index');
            $table->dropIndex('variantes_produto_active');
            $table->dropIndex('variantes_search_index');
        });

        // Remover índices da tabela variantes_atributo
        Schema::table('variantes_atributos', function (Blueprint $table) {
            $table->dropIndex('variantes_atributos_variante_id_index');
            $table->dropIndex('variantes_atributos_atributo_id_index');
            $table->dropIndex('variantes_atributos_composto');
        });

        // Remover índices da tabela pedidos
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropIndex('pedidos_status_index');
            $table->dropIndex('pedidos_type_index');
            $table->dropIndex('pedidos_cliente_id_index');
            $table->dropIndex('pedidos_total_index');
            $table->dropIndex('pedidos_created_at_index');
            $table->dropIndex('pedidos_status_date');
            $table->dropIndex('pedidos_type_date');
        });

        // Remover índices da tabela pedidos_produtos
        Schema::table('pedidos_produtos', function (Blueprint $table) {
            $table->dropIndex('pedidos_produtos_pedido_id_index');
            $table->dropIndex('pedidos_produtos_produto_id_index');
            $table->dropIndex('pedidos_produtos_composto');
        });

        // Remover índices da tabela clientes
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropIndex('clientes_name_index');
            $table->dropIndex('clientes_email_index');
            $table->dropIndex('clientes_cpf_index');
            $table->dropIndex('clientes_search_index');
        });

        // Remover índices da tabela categorias
        Schema::table('categorias', function (Blueprint $table) {
            $table->dropIndex('categorias_name_index');
            $table->dropIndex('categorias_active_index');
        });

        // Remover índices da tabela commissions
        Schema::table('commissions', function (Blueprint $table) {
            $table->dropIndex('commissions_vendedor_id_index');
            $table->dropIndex('commissions_pedido_id_index');
            $table->dropIndex('commissions_created_at_index');
        });

        // Remover índices da tabela users
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_email_index');
        });

        // Remover índices da tabela atributos
        Schema::table('atributos', function (Blueprint $table) {
            $table->dropIndex('atributos_name_index');
            $table->dropIndex('atributos_active_index');
        });
    }
}; 