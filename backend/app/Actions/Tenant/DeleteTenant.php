<?php

namespace App\Actions\Tenant;
use App\Models\Tenant;

class DeleteTenant
{
    public function execute(Tenant $tenant): bool
    {
        // Verifica se o tenant existe
        if (!$tenant) {
            throw new \Exception('Tenant não encontrado.');
        }

        // Exclui o tenant
        return $tenant->delete();
    }
}