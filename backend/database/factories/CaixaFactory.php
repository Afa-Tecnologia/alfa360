<?php

namespace Database\Factories;

use App\Models\Caixa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Caixa>
 */
class CaixaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'saldo_inicial' => $this->faker->randomFloat(2, 100, 1000),
            'saldo_final' => null,
            'open_date' => now(),
            'close_date' => null,
            'status' => 'aberto',
            'observation' => $this->faker->optional()->sentence(),
            'tenant_id' => $this->faker->uuid(),
        ];
    }

    /**
     * Indicate that the caixa is open.
     */
    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'aberto',
            'open_date' => now(),
            'close_date' => null,
            'saldo_final' => null,
        ]);
    }

    /**
     * Indicate that the caixa is closed.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'fechado',
            'open_date' => now()->subHours(8),
            'close_date' => now(),
            'saldo_final' => $this->faker->randomFloat(2, 100, 2000),
        ]);
    }
} 