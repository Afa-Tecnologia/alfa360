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
        Schema::create('devolucao_itens', function (Blueprint $table) {
            $table->id(); // Primary key numérica
            $table->uuid('uuid')->unique()->index(); // UUID para APIs externas
            $table->foreignId('devolucao_id')->constrained('devolucoes')->onDelete('cascade');
            $table->foreignId('produto_id')->constrained('produtos');
            $table->foreignId('pedido_id')->constrained('pedidos');
            $table->foreignId('variante_id')->constrained('variantes');
            $table->integer('quantidade');
            $table->decimal('valor_unitario', 10, 2);
            $table->decimal('valor_total', 10, 2);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucao_itens');
    }
};
