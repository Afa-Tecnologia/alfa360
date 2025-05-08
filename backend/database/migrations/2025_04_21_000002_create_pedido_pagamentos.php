<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up()
{
    Schema::create('pedido_pagamentos', function (Blueprint $table) {
        $table->id();
        $table->foreignId('pedido_id')->constrained()->cascadeOnDelete();
        $table->foreignId('payment_method_id')->constrained('pagamento_metodos');
        $table->decimal('total', 14, 2);
        $table->enum('status', [
            'PENDING','AUTHORIZED','CAPTURED',
            'CANCELLED','REFUNDED'
        ])->default('PENDING');
        $table->json('transaction_details')->nullable();
        $table->timestamp('paid_at')->nullable();
        $table->timestamps();
        $table->index(['pedido_id','status']);
    });
}

public function down(): void
{
    Schema::dropIfExists('pedido_pagamentos');
}
};
