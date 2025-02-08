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
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pedido_id');
            $table->unsignedBigInteger('vendedor_id');
            $table->unsignedBigInteger('produto_id');
            $table->decimal('valor', 8, 2);
            $table->integer('quantity');
            $table->decimal('percentual', 5, 2)->default(5); // Comissão de 5%
            $table->string('status')->default('pendente'); // Status da comissão (pendente, paga, etc.)
            $table->timestamps();

            // Relacionamentos
            $table->foreign('pedido_id')->references('id')->on('pedidos')->onDelete('cascade');
            $table->foreign('vendedor_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('produto_id')->references('id')->on('produtos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
