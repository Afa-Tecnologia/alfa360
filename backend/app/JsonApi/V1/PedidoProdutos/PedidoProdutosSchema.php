<?php

namespace App\JsonApi\V1\PedidoProdutos;

use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;

class PedidoProdutosSchema extends Schema
{
    public static string $model = \App\Models\PedidosProduto::class;

    public static function type(): string
    {
        return 'pedidos-produtos';
    }

    public function fields(): array
    {
        return [
            ID::make(),
            
            Number::make('pedido-id', 'pedido_id')
                ->sortable()
                ->readOnly(),
                
            Number::make('produto-id', 'produto_id')
                ->sortable()
                ->readOnly(),
                
            Number::make('vendedor-id', 'vendedor_id')
                ->sortable()
                ->readOnly(),
            
            Number::make('quantidade')
                ->sortable()
                ->readOnly(),
                
            Number::make('preco-unitario', 'preco_unitario')
                ->sortable()
                ->readOnly(),
                
            Number::make('valor-total')
                ->readOnly(),
          
            Number::make('quantidade-devolvida')
                ->readOnly(),

            DateTime::make('created-at', 'created_at')
                ->sortable()
                ->readOnly(),
                
            DateTime::make('updated-at', 'updated_at')
                ->sortable()
                ->readOnly(),
        ];
    }

    public function relations(): array
    {
        return [
            BelongsTo::make('pedido')
                ->type('pedidos')
                ->readOnly(),
                
            BelongsTo::make('produto')
                ->type('produtos')
                ->readOnly(),
                
            BelongsTo::make('vendedor')
                ->type('users') 
                ->readOnly(),
                
            HasMany::make('devolucao-itens')
                ->type('devolucao-itens')
                ->readOnly(),
        ];
    }

}