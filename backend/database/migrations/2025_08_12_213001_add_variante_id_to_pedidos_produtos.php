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
        if (Schema::hasTable('pedidos_produtos')) {
            Schema::table('pedidos_produtos', function (Blueprint $table) {
                if (!Schema::hasColumn('pedidos_produtos', 'variante_id')) {
                    $table->foreignId('variante_id')->nullable()->constrained('variantes');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('pedidos_produtos') && Schema::hasColumn('pedidos_produtos', 'variante_id')) {
            Schema::table('pedidos_produtos', function (Blueprint $table) {
                $table->dropForeign(['variante_id']);
                $table->dropColumn('variante_id');
            });
        }
    }
};

