<?php

namespace App\JsonApi\V1\Pedidos;

use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\Number;

class PedidoSchema extends Schema
{
    public static string $model = \App\Models\Pedido::class;

    public static function type(): string
    {
        return 'pedidos';
    }

    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('status'),
            Number::make('total'),
            Number::make('desconto'),
            DateTime::make('created_at')
        ];
    }
}
