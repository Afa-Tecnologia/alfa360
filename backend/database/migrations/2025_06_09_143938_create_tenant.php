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
         Schema::create('tenants', function (Blueprint $table) {
            $table->id('id'); 
            $table->string('nome');
            $table->string('subdominio')->unique();
            $table->foreignId('empresa_id')->nullable()->constrained('empresas');// nome do empresa exclusivo para o tenant
            $table->boolean('active')->default(true);
            $table->unsignedBigInteger('plano_id')->nullable();
            $table->timestamp('assinatura_expira_em')->nullable();
            $table->timestamps();
            $table->foreign('plano_id')->nullable()->references('id')->on('planos')->onDelete('set null');
            $table->uuid('tenant_id')->index(); // Adicionando tenant_id para multitenancy
            $table->softDeletes(); // Adicionando soft delete para o tenant
            $table->unique(['subdominio', 'tenant_id']); // Garantindo unicidade do subdomínio por tenant
            $table->index(['nome', 'tenant_id']); // Índice para consultas eficientes
            $table->index(['active', 'tenant_id']); // Índice para consultas de status ativo
            $table->index(['plano_id', 'tenant_id']); // Índice para consultas de plano
            $table->index(['assinatura_expira_em', 'tenant_id']); // Índice para consultas de expiração de assinatura
            $table->index(['created_at', 'tenant_id']); // Índice para consultas de criação
            $table->index(['updated_at', 'tenant_id']); // Índice para consultas de atualização
            $table->index(['deleted_at', 'tenant_id']); // Índice para consultas de exclusão suave
            $table->index(['empresa_id', 'tenant_id']); // Índice para consultas de empresa
            $table->index(['id', 'tenant_id']); // Índice para consultas de ID do tenant
            $table->index(['nome', 'subdominio', 'tenant_id']); // Índice para consultas de nome e subdomínio
            $table->index(['nome', 'active', 'tenant_id']); // Índice para consultas de nome e status ativo
            $table->index(['subdominio', 'active', 'tenant_id']); // Índice para consultas de subdomínio e status ativo
            $table->index(['plano_id', 'active', 'tenant_id']); // Índice para consultas de plano e status ativo
            $table->index(['assinatura_expira_em', 'active', 'tenant_id']); // Índice para consultas de expiração de assinatura e status ativo
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
