<?php

namespace App\JsonApi\V1;

use LaravelJsonApi\Core\Server\Server as BaseServer;

class Server extends BaseServer
{

    /**
     * The base URI namespace for this server.
     *
     * @var string
     */
    protected string $baseUri = '/api/v1';

    /**
     * Bootstrap the server when it is handling an HTTP request.
     *
     * @return void
     */
    public function serving(): void
    {
        // no-op
    }

    /**
     * Get the server's list of schemas.
     *
     * @return array
     */
    protected function allSchemas(): array
    {
        return [
            \App\JsonApi\V1\Devolucoes\DevolucaoSchema::class,
            \App\JsonApi\V1\Clientes\ClienteSchema::class,
            \App\JsonApi\V1\Pedidos\PedidoSchema::class,
            \App\JsonApi\V1\DevolucaoItens\DevolucaoItemSchema::class,
            \App\JsonApi\V1\PedidoProdutos\PedidoProdutosSchema::class

            
        ];
    }
}
