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
        Schema::create('devolucoes', function (Blueprint $table) {
            $table->id(); // Primary key numérica
            $table->uuid('uuid')->unique()->index(); // UUID para APIs externas
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->foreignId('cliente_id')->constrained('clientes');
            $table->enum('estado', ['pendente', 'aprovado', 'rejeitado', 'processado'])->default('pendente');
            $table->enum('motivo', ['defeito', 'garantia', 'cancelamento','arrependimento', 'outro']);
            $table->enum('tipo', ['total', 'parcial'])->default('troca');
            $table->text('observacao')->nullable();
            $table->dateTime('data_solicitacao');
            $table->dateTime('data_processamento')->nullable();
            $table->decimal('valor_reembolso', 10, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucoes');
    }
};
