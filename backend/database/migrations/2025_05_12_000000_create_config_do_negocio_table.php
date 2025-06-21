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
            $table->uuid('uuid')->index()->unique();
            $table->string('nome');
            $table->string('logo_url')->nullable();
            $table->string('cnpj')->nullable();
            $table->foreignId('tipos_de_negocios_id')->constrained('tipos_de_negocios')->nullable();
            $table->timestamps();
            $table->softDeletes();

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