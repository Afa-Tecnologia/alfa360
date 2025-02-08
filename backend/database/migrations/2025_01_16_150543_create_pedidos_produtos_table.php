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
        Schema::create('pedidos_produtos', function (Blueprint $table) { 
            $table->id(); 
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');  // Especificando a tabela 'pedidos'
            $table->foreignId('produto_id')->constrained('produtos')->onDelete('cascade'); // Especificando a tabela 'produtos'
            $table->integer('quantity'); 
            $table->decimal('selling_price', 8, 2); // Preço de venda do produto
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos_produtos');
    }
};
