<?php

namespace App\JsonApi\V1\Devolucoes;

use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;

class DevolucaoSchema extends Schema
{
    public static string $model = \App\Models\Devolucao::class;

    public static function type(): string
    {
        return 'devolucoes';
    }

    public function fields(): array
    {
        return [
            ID::make(), // ID numérico para performance
            Str::make('uuid')->readOnly(), // UUID público para APIs
            Str::make('motivo'),
            Str::make('tipo'),
            Str::make('estado'),
            Str::make('observacao'),
            DateTime::make('data_solicitacao'),
            DateTime::make('data_processamento'),
            Number::make('valor_reembolso'),
            BelongsTo::make('pedido'),
            BelongsTo::make('cliente'),
            HasMany::make('itens', 'devolucao-itens')
            ->canCount(),
            DateTime::make('created_at')->readOnly(),
            DateTime::make('updated_at')->readOnly(),
            
        ];

        
    }



    
}
