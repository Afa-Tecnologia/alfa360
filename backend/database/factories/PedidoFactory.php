<?php

namespace Database\Factories;

use App\Models\Pedido;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Caixa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pedido>
 */
class PedidoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cliente_id' => Cliente::factory(),
            'type' => $this->faker->randomElement(['ecommerce', 'loja']),
            'status' => $this->faker->randomElement(['PENDING', 'PROCESSING', 'PAYMENT_CONFIRMED', 'PARTIAL_PAYMENT', 'CONDITIONAL', 'ORDERED', 'CANCELLED']),
            'desconto' => $this->faker->randomFloat(2, 0, 100),
            'total' => $this->faker->randomFloat(3, 50, 1000),
            'tenant_id' => $this->faker->uuid(),
        ];
    }

    /**
     * Indicate that the pedido is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'PENDING',
        ]);
    }

    /**
     * Indicate that the pedido is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'PAYMENT_CONFIRMED',
        ]);
    }

    /**
     * Indicate that the pedido is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'CANCELLED',
        ]);
    }

    /**
     * Indicate that the pedido is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ORDERED',
        ]);
    }
} 