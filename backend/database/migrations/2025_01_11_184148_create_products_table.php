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
        Schema::create('produtos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('purchase_price', 8, 2);
            $table->decimal('selling_price', 8, 2);
            $table->integer('quantity');
            $table->enum('type', ['roupa', 'sapato', 'acessorio']);
            $table->string('image')->nullable();
            $table->string('marca');
            $table->string('size');
            $table->string('color');
            $table->string('code');
            $table->foreignId('categoria_id')->nullable()->constrained('categorias')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
};
