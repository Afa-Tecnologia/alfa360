<?php

namespace App\Services\ConfigDoNegocio;

use App\Models\ConfigDoNegocio;
use Illuminate\Database\Eloquent\Collection;

class ConfigDoNegocioService
{
    /**
     * Retorna todas as configurações de negócio.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll(): Collection
    {
        return ConfigDoNegocio::with('tiposDeNegocios')->get();
    }

    /**
     * Busca uma configuração de negócio pelo ID.
     *
     * @param int $id
     * @return \App\Models\ConfigDoNegocio|null
     */
    public function getById(int $id): ?ConfigDoNegocio
    {
        return ConfigDoNegocio::with('tiposDeNegocios')->find($id);
    }

    /**
     * Cria uma nova configuração de negócio.
     *
     * @param array $data
     * @return \App\Models\ConfigDoNegocio
     */
    public function create(array $data): ConfigDoNegocio
    {
        return ConfigDoNegocio::create($data);
    }

    /**
     * Atualiza uma configuração de negócio existente.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\ConfigDoNegocio|null
     */
    public function update(int $id, array $data): ?ConfigDoNegocio
    {
        $configDoNegocio = $this->getById($id);

        if (!$configDoNegocio) {
            return null;
        }

        $configDoNegocio->update($data);
        return $configDoNegocio->fresh('tiposDeNegocios');
    }

    /**
     * Exclui uma configuração de negócio.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $configDoNegocio = $this->getById($id);

        if (!$configDoNegocio) {
            return false;
        }

        return $configDoNegocio->delete();
    }
} 