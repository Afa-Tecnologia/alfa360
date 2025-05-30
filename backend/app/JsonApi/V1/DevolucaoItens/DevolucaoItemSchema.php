<?php

namespace App\JsonApi\V1\DevolucaoItens;

use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;

class DevolucaoItemSchema extends Schema
{
    public static string $model = \App\Models\DevolucaoItem::class;

    public static function type(): string
    {
        return 'devolucao-itens';
    }

    public function fields(): array
    {
        return [
            ID::make(),
            Number::make('quantidade'),
            Number::make('valor_unitario'),
            Number::make('valor_total')->readOnly(),
            Str::make('motivo'),
            
            // Relacionamentos essenciais
            BelongsTo::make('devolucao'), // CORRIGIDO: era 'devolucoe'
            BelongsTo::make('pedido'),
            
            // Relacionamentos derivados
            BelongsTo::make('produto')->readOnly(),
            BelongsTo::make('variante')->readOnly(),
            
            DateTime::make('created_at')->readOnly(),
            DateTime::make('updated_at')->readOnly(),
        ];
    }
}