<?php 

namespace App\Actions\Tenant;
use App\Models\Tenant;

class UpdateTenant
{
    public function execute(Tenant $tenant, array $data): Tenant
    {
        // Verifica se o subdomínio já está em uso por outro tenant
        if (isset($data['subdominio']) && Tenant::where('subdominio', $data['subdominio'])->where('id', '!=', $tenant->id)->exists()) {
            throw new \Exception('Subdomínio já está em uso por outro tenant.');
        }

        // Atualiza os dados do tenant
        $tenant->update([
            'nome' => $data['nome'] ?? $tenant->nome,
            'subdominio' => $data['subdominio'] ?? $tenant->subdominio,
            'plano_id' => $data['plano_id'] ?? $tenant->plano_id,
            'assinatura_expira_em' => $data['assinatura_expira_em'] ?? $tenant->assinatura_expira_em,
        ]);

        return $tenant;
    }
}