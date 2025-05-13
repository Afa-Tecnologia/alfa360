<?php

namespace App\Services\TipoDeNegocios;

use App\Models\TipoDeNegocios;
use Illuminate\Database\Eloquent\Collection;

class TipoDeNegociosService
{
    /**
     * Retorna todos os tipos de negócios.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll(): Collection
    {
        return TipoDeNegocios::all();
    }

    /**
     * Busca um tipo de negócio pelo ID.
     *
     * @param int $id
     * @return \App\Models\TipoDeNegocios|null
     */
    public function getById(int $id): ?TipoDeNegocios
    {
        return TipoDeNegocios::find($id);
    }

    /**
     * Cria um novo tipo de negócio.
     *
     * @param array $data
     * @return \App\Models\TipoDeNegocios
     */
    public function create(array $data): TipoDeNegocios
    {
        return TipoDeNegocios::create($data);
    }

    /**
     * Atualiza um tipo de negócio existente.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\TipoDeNegocios|null
     */
    public function update(int $id, array $data): ?TipoDeNegocios
    {
        $tipoDeNegocio = $this->getById($id);

        if (!$tipoDeNegocio) {
            return null;
        }

        $tipoDeNegocio->update($data);
        return $tipoDeNegocio;
    }

    /**
     * Exclui um tipo de negócio.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $tipoDeNegocio = $this->getById($id);

        if (!$tipoDeNegocio) {
            return false;
        }

        return $tipoDeNegocio->delete();
    }
} 