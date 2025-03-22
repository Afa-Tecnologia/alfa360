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
        Schema::create('movimentacao_caixas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caixa_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->enum('type', ['entrada', 'saida']);
            $table->enum('local',['loja', 'ecommerce']);
            $table->decimal('value', 10, 2);
            $table->string('description', 200);
            $table->enum('payment_method', ['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'MONEY', 'TRANSFER', 'CONDITIONAL']);
            $table->enum('status', ['pending', 'completed', 'canceled'])->default('pending');
            $table->json('additional_data')->nullable();
            $table->foreignId('pedido_id')->nullable()->constrained('pedidos')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimentacao_caixas', function (Blueprint $table) {
            $table->dropForeign(['pedido_id', 'caixa_id', 'user_id']);
        });
        Schema::dropIfExists('movimentacao_caixas');
    }
};
