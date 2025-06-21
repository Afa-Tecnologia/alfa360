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
        Schema::create('assinaturas', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index()->unique();
            $table->foreignId('empresa_id')->constrained('empresas');
            $table->foreignId('plano_id')->constrained('planos');
            $table->foreignId('criado_por')->nullable()->constrained('users');
            
            // Status e datas
            $table->enum('status', [
                'trial',            // Período de avaliação
                'ativa',            // Assinatura paga e ativa
                'pendente',         // Aguardando pagamento
                'inadimplente',     // Pagamento atrasado
                'cancelada',        // Cancelada pelo usuário
                'expirada'          // Expirou naturalmente
            ])->default('trial');
            
            $table->timestamp('inicio_em');
            $table->timestamp('expira_em');
            $table->timestamp('cancelada_em')->nullable();
            $table->timestamp('ultimo_pagamento')->nullable();
            
            // Detalhes financeiros
            $table->decimal('valor', 10, 2);
            $table->string('forma_pagamento')->nullable(); // 'cartao', 'boleto', 'pix'
            $table->string('gateway_pagamento')->nullable(); // 'stripe', 'pagseguro', etc
            $table->string('id_transacao_gateway')->nullable();
            
            // Configurações de renovação
            $table->boolean('renovacao_automatica')->default(true);
            $table->text('motivo_cancelamento')->nullable();
            
            // Limites personalizados (override do plano se necessário)
            $table->integer('max_usuarios_override')->nullable();
            $table->json('configuracoes_personalizadas')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para consultas frequentes
            $table->index(['empresa_id', 'status']);
            $table->index('expira_em');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assinaturas');
    }
};
