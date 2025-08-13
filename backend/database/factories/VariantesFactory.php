<?php

namespace Database\Factories;

use App\Models\Variantes;
use App\Models\Produto;
use App\Models\Atributo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Variantes>
 */
class VariantesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'produto_id' => Produto::factory(),
            'name' => $this->faker->word(),
            'type' => $this->faker->randomElement(['color', 'size', 'material']),
            'quantity' => $this->faker->numberBetween(0, 50),
            'active' => $this->faker->boolean(80),
            'code' => $this->faker->optional()->ean13(),
            'images' => null,
            'tenant_id' => $this->faker->uuid(),
        ];
    }

    /**
     * Indicate that the variante is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'active' => true,
        ]);
    }

    /**
     * Indicate that the variante is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'active' => false,
        ]);
    }

    /**
     * Indicate that the variante has stock.
     */
    public function inStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => $this->faker->numberBetween(1, 50),
        ]);
    }

    /**
     * Indicate that the variante is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => 0,
        ]);
    }
} 