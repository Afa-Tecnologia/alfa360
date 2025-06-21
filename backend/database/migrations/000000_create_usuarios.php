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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->uuid('empresa_id')->nullable();
            $table->string('nome');
            $table->string('sobrenome');
            $table->string('cpf')->unique();
            $table->string('telefone')->unique();
            $table->string('endereco');
            $table->string('cidade');
            $table->string('estado');
            $table->string('cep');
            $table->string('email')->unique();
            $table->string('senha');
            $table->boolean('ativo')->default(true);
            $table->timestamps();
            $table->rememberToken();
            $table->softDeletes();
        
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
