<?php

namespace App\Http\Controllers\DevolucaoItem;

use App\Http\Controllers\Controller;
use App\Models\DevolucaoItem;
use App\Models\Pedido;
use Illuminate\Http\Request;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use Illuminate\Support\Str;

class DevolucaoItemController extends JsonApiController
{
    public function __construct()
    {
        // Registrar um evento para interceptar a criação de item de devolução
        DevolucaoItem::creating(function ($item) {
            // Verificar se os relacionamentos estão sendo definidos corretamente
            if (request()->json('data.relationships.devolucao.data.id')) {
                $item->devolucao_id = request()->json('data.relationships.devolucao.data.id');
            }

            // Gerar UUID automaticamente
            $item->uuid = (string) Str::uuid();
            
            // Obter informações do pedido-produto e derivar produto e variante
            if (request()->json('data.relationships.pedido.data.id')) {
                $pedidoId = request()->json('data.relationships.pedido.data.id');
                $item->pedido_id = $pedidoId;


                
                // Buscar o pedido
                $pedido = Pedido::find($pedidoId);
                if ($pedido) {
                    // Definir produto_id e variante_id automaticamente
                    $item->produto_id = $pedido->produto_id;
                    $item->variante_id = $pedido->variante_id;
                    
                    // Se não tiver valor unitário, usar o do pedido-produto
                    if (empty($item->valor_unitario)) {
                        $item->valor_unitario = $pedido->valor_unitario;
                    }

                }
            }
            
            // Calcular valor total se necessário
            if (!empty($item->quantidade) && !empty($item->valor_unitario) && empty($item->valor_total)) {
                $item->valor_total = $item->quantidade * $item->valor_unitario;
            }
            
            return $item;
        });
    }
}
