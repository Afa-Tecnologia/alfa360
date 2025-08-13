<?php

namespace Database\Factories;

use App\Models\TiposDeProdutos;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TiposDeProdutos>
 */
class TiposDeProdutosFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nome' => $this->faker->unique()->words(2, true),
            'descricao' => $this->faker->sentence(),
            'ativo' => $this->faker->boolean(80), // 80% chance of being active
            'tenant_id' => $this->faker->uuid(),
        ];
    }

    /**
     * Indicate that the tipo de produto is active.
     */
    public function ativo(): static
    {
        return $this->state(fn (array $attributes) => [
            'ativo' => true,
        ]);
    }

    /**
     * Indicate that the tipo de produto is inactive.
     */
    public function inativo(): static
    {
        return $this->state(fn (array $attributes) => [
            'ativo' => false,
        ]);
    }
} 