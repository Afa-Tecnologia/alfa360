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
        Schema::create('pagamento_metodos', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();       // ex: PIX, CREDIT_CARD
            $table->string('name');
            $table->json('config')->nullable();     // credenciais, URLs, fees...
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagamento_metodos');
    }
};
