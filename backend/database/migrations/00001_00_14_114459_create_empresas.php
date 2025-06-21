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
        Schema::create('empresas', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index(); // UUID para identificação única
            $table->string('nome');
            $table->string('cnpj')->unique();
            $table->string('razao_social')->unique();
            $table->string('nome_fantasia')->nullable();
            $table->string('email')->unique();
            $table->string('telefone');
            $table->string('endereco')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();
            $table->string('cep')->nullable();
            $table->string('logo')->nullable();
            $table->string('dominio')->unique()->nullable();
            $table->string('slug')->unique();
            $table->boolean('ativo')->default(true);
            $table->timestamp('trial_expira_em')->nullable();
            $table->timestamp('assinatura_expira_em')->nullable();
            $table->foreignId('owner_id')->constrained('users')->nullable();
            $table->foreignId('plano_id')->constrained('planos');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
