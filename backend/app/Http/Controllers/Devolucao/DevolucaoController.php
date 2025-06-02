<?php

namespace App\Http\Controllers\Devolucao;

use App\Http\Controllers\Controller;
use App\JsonApi\V1\Devolucoes\DevolucaoQuery;
use App\JsonApi\V1\Devolucoes\DevolucaoRequest;
use App\Models\Devolucao;
use App\Services\Devolucao\DevolucaoService;
use Illuminate\Http\Request;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DevolucaoController extends JsonApiController
{
    protected $devolucaoService;

    public function __construct(DevolucaoService $devolucaoService)
    {
        $this->devolucaoService = $devolucaoService;
    }

    public function creating(DevolucaoRequest $request) {

        return DB::transaction(function () use ($request) {
            $data = $request->json('data');
            $attributes = $data['attributes'] ?? [];
            $relationships = $data['relationships'] ?? [];
            $included = $request->json('included', []);

            // Monta os relacionamentos dos itens a partir do included
            $itens = [];
            foreach ($included as $item) {
                if ($item['type'] === 'devolucao-itens') {
                    $itemData = [
                        'attributes' => $item['attributes'] ?? [],
                        'relationships' => $item['relationships'] ?? [],
                    ];
                    $itens[] = $itemData;
                }
            }

            // Monta o array para o service
            $serviceAttributes = [

                'motivo' => $attributes['motivo'] ?? null,
                'tipo' => $attributes['tipo'] ?? null,
                'observacao' => $attributes['observacao'] ?? null,
                'pedido_id' => $relationships['pedido']['data']['id'] ?? null,
                'variante_id' => $relationships['variante']['data']['id'] ?? null,
                'cliente_id' => $relationships['cliente']['data']['id'] ?? null,
                'data_solicitacao' => now(),
            ];

            $serviceRelationships = [
                'pedido' => $relationships['pedido']['data']['id'] ?? null,
                'cliente' => $relationships['cliente']['data']['id'] ?? null,
                'itens' => [
                    'data' => $itens
                ]
            ];

            // Chama o service para criar devolução + itens
            $devolucao = $this->devolucaoService->createWithItens($serviceAttributes, $serviceRelationships);

            // Carrega os relacionamentos para resposta
            $devolucao->load('itens', 'pedido', 'cliente');

            // Separe os atributos simples
            $attributes = $devolucao->only([
                'motivo', 'tipo', 'observacao', 'data_solicitacao', 'uuid', 'estado', 'updated_at', 'created_at'
            ]);

            // Monte relationships
            $relationships = [
                'itens' => [
                    'data' => $devolucao->itens->map(fn($item) => [
                        'type' => 'devolucao-itens',
                        'id' => (string) $item->id,
                    ])
                ],
                'pedido' => [
                    'data' => [
                        'type' => 'pedidos',
                        'id' => (string) $devolucao->pedido->id,
                    ]
                ],
                'cliente' => [
                    'data' => [
                        'type' => 'clientes',
                        'id' => (string) $devolucao->cliente->id,
                    ]
                ]
            ];

            // Inclua os recursos relacionados
            $included = collect();

            foreach ($devolucao->itens as $item) {
                $included->push([
                    'type' => 'devolucao-itens',
                    'id' => (string) $item->id,
                    'attributes' => $item->toArray(),
                ]);
            }

            $included->push([
                'type' => 'pedidos',
                'id' => (string) $devolucao->pedido->id,
                'attributes' => $devolucao->pedido->toArray(),
            ]);

            $included->push([
                'type' => 'clientes',
                'id' => (string) $devolucao->cliente->id,
                'attributes' => $devolucao->cliente->toArray(),
            ]);

            return response()->json([
                'data' => [
                    'type' => 'devolucoes',
                    'id' => (string) $devolucao->id,
                    'attributes' => $attributes,
                    'relationships' => $relationships,
                ],
                'included' => $included,
            ], 201);
        });
    }



    
    
}
