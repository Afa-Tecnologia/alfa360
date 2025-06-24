<?php
namespace App\Actions\Tenant;
use App\Models\Tenant;

class CreateTenant
{
    public function execute(array $data): Tenant
    {
        // Verifica se o subdomínio já está em uso
        if (Tenant::where('subdominio', $data['subdominio'])->exists()) {
            throw new \Exception('Subdomínio já está em uso.');
        }

        // Cria o novo tenant
        $tenant = Tenant::create([
            'nome' => $data['nome'],
            'subdominio' => $data['subdominio'],
            'plano_id' => $data['plano_id'],
            'assinatura_expira_em' => $data['assinatura_expira_em'] ?? null,
        ]);

        return $tenant;
    }
}
