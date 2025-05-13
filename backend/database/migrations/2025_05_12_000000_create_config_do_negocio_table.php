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
        Schema::create('config_do_negocios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('logo_url')->nullable();
            $table->string('cnpj')->nullable();
            $table->foreignId('tipo_de_negocio_id')->constrained('tipo_de_negocios');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('config_do_negocios');
    }
}; 