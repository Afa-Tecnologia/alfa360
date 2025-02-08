<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('itens_pedidos', function (Blueprint $table) {
        $table->id();
        $table->foreignId('produto_id')->constrained('produtos');
        $table->foreignId('pedido_id')->constrained('pedidos');
        $table->integer('quantidade');
        $table->decimal('preco_unitario', 8, 2);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itens_pedidos');
    }
};
