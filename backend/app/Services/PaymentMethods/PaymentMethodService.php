<?php

namespace App\Services\PaymentMethods;

use App\Models\PaymentMethod;
use App\Models\Tenant;
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
        // Check if a payment method with the same code already exists
        $existingMethod = PaymentMethod::where('code', $data['code'])
        ->where('tenant_id', Tenant::current()->id ?? null)
        ->first();
        if ($existingMethod) {
            throw new \Exception('Metodo de pagamento com o mesmo código já existe.');
        }

        return PaymentMethod::create($data);
    }

    public function update(int $id, array $data): PaymentMethod
    {
        $paymentMethod = $this->find($id);
        // Check if a payment method with the same code already exists, excluding the current one
        $existingMethod = PaymentMethod::where('code', $data['code'])
            ->where('tenant_id', Tenant::current()->id ?? null)
            ->where('id', '!=', $id)
            ->first();
        if ($existingMethod) {
            throw new \Exception('Metodo de pagamento com o mesmo código já existe.');
        }

       
        $paymentMethod->update($data);
        return $paymentMethod;
    }

    public function delete(int $id): void
    {
        $paymentMethod = $this->find($id);
        $paymentMethod->delete();
    }
} 