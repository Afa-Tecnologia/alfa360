<?php

namespace App\Services\PaymentMethods;

use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Collection;

class PaymentMethodService
{
    public function getAll(): Collection
    {
        return PaymentMethod::all();
    }

    public function find(int $id): PaymentMethod
    {
        return PaymentMethod::findOrFail($id);
    }

    public function create(array $data): PaymentMethod
    {
        return PaymentMethod::create($data);
    }

    public function update(int $id, array $data): PaymentMethod
    {
        $paymentMethod = $this->find($id);
        $paymentMethod->update($data);
        return $paymentMethod;
    }

    public function delete(int $id): void
    {
        $paymentMethod = $this->find($id);
        $paymentMethod->delete();
    }
} 