<?php

namespace Database\Seeders;

use App\Models\Produto;
use Illuminate\Database\Seeder;

class ProdutoSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Produto::factory()->create([
            "name" => "Saia de renda",
            "description" => "Saia de rendas",
            "purchase_price" => 50,
            "selling_price" => 87.89,
            "quantity" => 10,
            "categoria_id" => 1
        ]);
    }
}
