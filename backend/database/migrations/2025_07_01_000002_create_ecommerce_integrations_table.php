<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ecommerce_integrations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id');
            $table->string('platform')->default('woocommerce');
            $table->string('url');
            $table->string('key');
            $table->string('secret');
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->unique(['tenant_id', 'platform']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ecommerce_integrations');
    }
}; 