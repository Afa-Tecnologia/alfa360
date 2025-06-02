<?php

namespace App\JsonApi\V1\Devolucoes;

use LaravelJsonApi\Laravel\Http\Requests\ResourceQuery;
use LaravelJsonApi\Eloquent\Filters\Where;

class DevolucaoQuery extends ResourceQuery
{
    /**
     * Definir filtros permitidos na query string.
     */
    public function filters(): array
    {
        return [
            Where::make('estado'),
            Where::make('motivo'),
            Where::make('tipo'),
        ];
    }

    /**
     * Definir campos ordenáveis.
     */
    public function sortables(): array
    {
        return ['created_at', 'estado', 'data_solicitacao'];
    }

    public function with(): array
    {
        return ['itens', 'pedido', 'cliente'];
    }
}

