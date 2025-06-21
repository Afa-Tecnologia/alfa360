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
        Schema::create('faturas', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index()->unique();
            $table->foreignId('assinatura_id')->constrained('assinaturas');
            $table->foreignId('empresa_id')->constrained('empresas');
            
            $table->string('numero')->unique();
            $table->enum('status', [
                'pendente',
                'paga', 
                'cancelada', 
                'vencida',
                'reembolsada'
            ])->default('pendente');
            
            $table->decimal('valor', 10, 2);
            $table->decimal('desconto', 10, 2)->default(0);
            $table->decimal('valor_final', 10, 2);
            
            $table->date('data_emissao');
            $table->date('data_vencimento');
            $table->date('data_pagamento')->nullable();
            
            $table->string('forma_pagamento')->nullable();
            $table->string('link_boleto')->nullable();
            $table->string('codigo_pix')->nullable();
            $table->string('id_transacao')->nullable();
            
            $table->text('observacoes')->nullable();

            $table->index(['empresa_id', 'status']);
            $table->index('data_vencimento');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faturas');
    }
};
