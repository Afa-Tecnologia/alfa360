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
        Schema::create('woocommerce_sync', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pdv_id'); // ID do PDV
            $table->unsignedBigInteger('woocommerce_id'); // ID do WooCommerce
            $table->string('entity_type'); // Ex: 'product', 'category', 'order'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
