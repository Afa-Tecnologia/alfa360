<?php

namespace Database\Factories;

use App\Models\Produto;
use App\Models\Categoria;
use App\Models\TiposDeProdutos;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Produto>
 */
class ProdutoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->paragraph(),
            'purchase_price' => $this->faker->randomFloat(2, 5, 500),
            'selling_price' => $this->faker->randomFloat(2, 10, 1000),
            'quantity' => $this->faker->numberBetween(0, 100),
            'tipo_de_produto_id' => TiposDeProdutos::factory(),
            'brand' => $this->faker->company(),
            'code' => $this->faker->unique()->ean13(),
            'categoria_id' => Categoria::factory(),
            'tenant_id' => null, // Será definido dinamicamente nos testes
        ];
    }

    /**
     * Indicate that the produto is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'active' => true,
        ]);
    }

    /**
     * Indicate that the produto is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'active' => false,
        ]);
    }

    /**
     * Indicate that the produto has stock.
     */
    public function inStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => $this->faker->numberBetween(1, 100),
        ]);
    }

    /**
     * Indicate that the produto is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }
} 