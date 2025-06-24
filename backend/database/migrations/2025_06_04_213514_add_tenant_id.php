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
        // Lista de todas suas tabelas existentes
        $tables = [
            'produtos','variantes','pedidos_produtos','caixas','movimentacao_caixas', 
            'pedidos', 'clientes', 'categorias','tipo_de_produto', 
            'pagamento_metodos','pedido_pagamentos','commissions',
            'config_do_negocios','devolucoes','devolucao_itens',
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->uuid('tenant_id')->after('id')->index();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'produtos','variantes','pedidos_produtos','caixas','movimentacao_caixas', 
            'pedidos', 'clientes', 'categorias','tipo_de_produto', 
            'pagamento_metodos','pedido_pagamentos','commissions',
            'config_do_negocios','devolucoes','devolucao_itens',
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('tenant_id');
            });
        }
    }
};
