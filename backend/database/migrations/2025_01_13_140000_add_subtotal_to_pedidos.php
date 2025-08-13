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
        // Verificar se a coluna não existe antes de adicionar
        if (!Schema::hasColumn('pedidos', 'subtotal')) {
            Schema::table('pedidos', function (Blueprint $table) {
                $table->decimal('subtotal', 10, 2)->nullable()->after('total')
                    ->comment('Valor bruto antes do desconto');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            if (Schema::hasColumn('pedidos', 'subtotal')) {
                $table->dropColumn('subtotal');
            }
        });
    }
};