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
        Schema::create('perfil_permissao', function (Blueprint $table) {
            $table->foreignUuid('perfil_id')->constrained('perfis')->onDelete('cascade');
            $table->foreignUuid('permissao_id')->constrained('permissions')->onDelete('cascade');
            $table->index(['perfil_id', 'permissao_id']);
            $table->primary(['perfil_id', 'permissao_id']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perfil_permissao');
    }
};
