<?php

namespace Database\Factories;

use App\Models\MovimentacaoCaixa;
use App\Models\Caixa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MovimentacaoCaixa>
 */
class MovimentacaoCaixaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'caixa_id' => Caixa::factory(),
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['entrada', 'saida']),
            'local' => $this->faker->randomElement(['loja', 'ecommerce']),
            'value' => $this->faker->randomFloat(2, 10, 500),
            'description' => $this->faker->sentence(200),
            'payment_method' => $this->faker->randomElement(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'MONEY', 'TRANSFER', 'CONDITIONAL']),
            'status' => $this->faker->randomElement(['pending', 'completed', 'canceled']),
            'additional_data' => $this->faker->optional()->json(),
            'pedido_id' => $this->faker->optional()->numberBetween(1, 100),
            'tenant_id' => $this->faker->uuid(),
        ];
    }

    /**
     * Indicate that the movimentacao is an entrada (income).
     */
    public function entrada(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'entrada',
        ]);
    }

    /**
     * Indicate that the movimentacao is a saida (expense).
     */
    public function saida(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'saida',
        ]);
    }

    /**
     * Indicate that the movimentacao is paid in cash.
     */
    public function dinheiro(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'MONEY',
        ]);
    }

    /**
     * Indicate that the movimentacao is paid by card.
     */
    public function cartao(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'CREDIT_CARD',
        ]);
    }
} 