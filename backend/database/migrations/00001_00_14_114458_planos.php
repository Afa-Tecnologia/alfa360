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
        Schema::create('planos', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index(); 
            $table->string('nome');
            $table->string('slug')->unique();
            $table->text('descricao')->nullable();
            $table->enum('frequencia', ['mensal', 'trimestral', 'semestral', 'anual'])->default('mensal');
            $table->decimal('preco', 10, 2);
            $table->integer('max_usuarios')->default(1);
            $table->integer('max_produtos')->default(100);
            $table->integer('max_vendas_mensais')->nullable();
            $table->boolean('permite_multi_pdv')->default(false);
            $table->boolean('permite_multi_empresas')->default(false);
            $table->boolean('inclui_ecommerce')->default(false);
            $table->boolean('inclui_relatorios_avancados')->default(false);
            $table->boolean('inclui_financeiro')->default(false);
            $table->boolean('inclui_app_mobile')->default(false);
            $table->boolean('inclui_suporte_premium')->default(false);
            $table->integer('duracao_trial')->default(15); // dias
            $table->json('recursos_adicionais')->nullable();
            $table->boolean('destaque')->default(false);
            $table->boolean('ativo')->default(true);
            $table->integer('ordem_exibicao')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planos');
    }
};
