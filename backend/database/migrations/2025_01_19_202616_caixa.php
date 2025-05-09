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
        Schema::create('caixas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->decimal('saldo_inicial', 10, 2);
            $table->decimal('saldo_final', 10, 2)->nullable();
            $table->timestamp('open_date');
            $table->timestamp('close_date')->nullable();
            $table->enum('status', [
                'aberto',
                'fechado',
                'cancelado',
                'pendente',
                'confirmado',
                'inativo',
                'ativo'
            ])->default('aberto');
            $table->text('observation')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caixas');
    }
};
