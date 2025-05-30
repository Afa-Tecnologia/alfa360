<?php

namespace App\JsonApi\V1\DevolucaoItens;

use App\Models\DevolucaoItem;
use Illuminate\Http\Request;
use LaravelJsonApi\Core\Resources\JsonApiResource;

/**
 * @property DevolucaoItem $resource
 */
class DevolucaoItemResource extends JsonApiResource
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
            'quantidade' => $this->resource->quantidade,
            'valor_unitario' => $this->resource->valor_unitario,
            'valor_total' => $this->resource->valor_total,
            'motivo' => $this->resource->motivo,
            'createdAt' => $this->resource->created_at,
            'updatedAt' => $this->resource->updated_at,
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
            'devolucao' => $this->relation('devolucao', $this->resource->devolucao),
            'produto' => $this->relation('produto'),
            'variante' => $this->relation('variante'),
            'pedido' => $this->relation('pedido', $this->resource->pedido),
        ];
    }

}
