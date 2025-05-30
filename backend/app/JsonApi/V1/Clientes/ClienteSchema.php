<?php

namespace App\JsonApi\V1\Clientes;

use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;

class ClienteSchema extends Schema
{
    public static string $model = \App\Models\Cliente::class;

    public static function type(): string
    {
        return 'clientes';
    }

    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('nome'),
            Str::make('email'),
        ];
    }
}
