<?php
namespace App\Actions\Empresa;
use App\Models\Empresa;

class CreateEmpresa
{
    public function execute(array $data): Empresa
    {
        // Verifica se o CNPJ já está em uso
        if (Empresa::where('cnpj', $data['cnpj'])->exists()) {
            throw new \Exception('CNPJ já está em uso.');
        }

        // Cria a nova empresa
        $empresa = Empresa::create($data);

        return $empresa;
    }
}