<?php

namespace App\JsonApi\V1\Devolucoes;

use App\Models\Devolucao;
use Illuminate\Http\Request;
use LaravelJsonApi\Core\Resources\JsonApiResource;

/**
 * @property Devolucao $resource
 */
class DevolucaoResource extends JsonApiResource
{

    /**
     * Get the resource's attributes.
     *
     * @param Request|null $request
     * @return iterable
     */
    public function attributes($request): iterable
    {


        return [
            'uuid' => $this->uuid,
            'motivo' => $this->motivo,
            'tipo' => $this->tipo,
            'observacao' => $this->observacao,
            'pedido_id' => (string) $this->pedido_id,
            'cliente_id' => (string) $this->cliente_id,
            'data_solicitacao' => $this->data_solicitacao,
            'estado' => $this->estado,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get the resource's relationships.
     *
     * @param Request|null $request
     * @return iterable
     */
    public function relationships($request): iterable
    {
        return [
            'itens' => $this->relation('itens'),
            'pedido' => $this->relation('pedido'),
            'cliente' => $this->relation('cliente'),
        ];
    }

}
