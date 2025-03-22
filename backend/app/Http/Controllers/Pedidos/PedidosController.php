<?php

namespace App\Http\Controllers\Pedidos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pedidos\StorePedidoRequest;
use App\Http\Requests\Pedidos\UpdatePedidoRequest;
use App\Models\Pedido;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Pedidos\Pedidos;
use App\Services\Pedidos\PedidoService;

class PedidosController extends Controller
{
    protected $pedidoService;

    public function __construct(PedidoService $pedidoService)
    {
        $this->pedidoService = $pedidoService;
    }

    // Método para obter todos os pedidos
    public function index()
    {
        $pedidos = $this->pedidoService->getAll();
        return response()->json($pedidos);
    }

    // Método para criar pedidos
    public function store(StorePedidoRequest $request)
    {
        // Adiciona logs para debug
        Log::info('Recebeu requisição de criação de pedido');
        Log::info('Dados recebidos: ', $request->all());
        
        try {
            $dataValidated = $request->validated();
            Log::info('Dados validados: ', $dataValidated);
            
            // Garantindo que payment_method esteja em maiúsculas
            $dataValidated['payment_method'] = strtoupper($dataValidated['payment_method']);
            
            // Criando pedido
            $pedido = Pedido::create([
                'vendedor_id' => $dataValidated['vendedor_id'],
                'cliente_id' => $dataValidated['cliente_id'],
                'type' => $dataValidated['type'],
                'payment_method' => $dataValidated['payment_method'],
                'desconto' => $dataValidated['desconto'] ?? 0,
                'total' => 0,
            ]);
            
            Log::info('Pedido criado: ' . $pedido->id);
            
            $total = 0;
            foreach ($dataValidated['produtos'] as $item) {
                $produto = Produto::findOrFail($item['produto_id']);
                $subtotal = $produto->selling_price * $item['quantidade'];
    
                $pedido->produtos()->attach($produto->id, [
                    'quantidade' => $item['quantidade'],
                    'preco_unitario' => $produto->selling_price,
                ]);
    
                $total += $subtotal;
            }
    
            $pedido->update(['total' => $total - ($dataValidated['desconto'] ?? 0)]);
    
            return response()->json([
                'message' => 'Pedido criado com sucesso!',
                'pedido' => $pedido->load('produtos'),
            ], 201);
        
        } catch (\Exception $e) {
            Log::error('Erro ao criar pedido: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'error' => 'Erro ao criar pedido',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para obter um produto por ID
    public function show($id)
    {
        $pedido = $this->pedidoService->getById($id);

        if (!$pedido) {
            return response()->json(
                ['error' => 'Pedido não encontrado'],
                Response::HTTP_NOT_FOUND
            );
        }

        // Inclui os produtos associados ao pedido
        $pedido->load('produtos'); // Garantir que os produtos sejam carregados com o pedido

        return response()->json($pedido);
    }

    // Método para obter um produto pelo nome
    public function findByCategory($id)
    {
        $pedidos = $this->pedidoService->getProdutoPorCategoria($id);
        if (!$pedidos) {
            return response()->json(
                ['error' => 'O parâmetro "id" é obrigatório ou categoria inexistente'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return response()->json($pedidos);
    }

    // Método para obter um pedidos por tipo
    public function findByType($tipo)
    {
        $pedidos = $this->pedidoService->getPedidosPorTipo($tipo);
        if (!$pedidos) {
            return response()->json(
                ['error' => 'O parâmetro "tipo" é obrigatório ou categoria inexistente'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return response()->json($pedidos);
    }

    public function update(UpdatePedidoRequest $request, $id)
    {
        try {
            $dataValidated = $request->validated();
            Log::info('Atualizando pedido ID: ' . $id);
            Log::info('Dados validados: ', $dataValidated);
            
            // Garantindo que payment_method esteja em maiúsculas se estiver presente
            if (isset($dataValidated['payment_method'])) {
                $dataValidated['payment_method'] = strtoupper($dataValidated['payment_method']);
            }
            
            // Atualiza o pedido
            $pedido = $this->pedidoService->update($id, $dataValidated);

            if (!$pedido) {
                return response()->json(['error' => 'Pedido não encontrado'], 404);
            }

            // Atualiza os produtos do pedido se fornecidos
            if (isset($dataValidated['produtos'])) {
                // Remover todos os produtos antigos
                $pedido->produtos()->detach();

                $total = 0;
                // Adiciona os novos produtos
                foreach ($dataValidated['produtos'] as $item) {
                    $produto = Produto::findOrFail($item['produto_id']);
                    $subtotal = $produto->selling_price * $item['quantidade'];
    
                    $pedido->produtos()->attach($produto->id, [
                        'quantidade' => $item['quantidade'],
                        'preco_unitario' => $produto->selling_price,
                    ]);
    
                    $total += $subtotal;
                }
                
                // Atualiza o total do pedido
                $pedido->update([
                    'total' => $total - ($dataValidated['desconto'] ?? $pedido->desconto)
                ]);
            }

            return response()->json([
                'message' => 'Pedido atualizado com sucesso',
                'pedido' => $pedido->load('produtos')
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar pedido: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'error' => 'Erro ao atualizar pedido',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para deletar um produto
    public function delete(string $id)
    {
        try {
            $pedido = $this->pedidoService->delete($id);

            if (!$pedido) {
                return response()->json(
                    ['error' => 'Produto não encontrado'],
                    Response::HTTP_NOT_FOUND
                );
            }

            return response()->json(
                ['message' => 'Produto deletado com sucesso'],
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao deletar produto'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
