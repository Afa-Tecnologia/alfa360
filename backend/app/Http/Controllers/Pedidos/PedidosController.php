<?php

namespace App\Http\Controllers\Pedidos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
    public function store(Request $request)
    {
        try {
            // Validação dos dados
            $data = $request->validate([
                'vendedor_id' => 'required|string|exists:users,id',
                'cliente_id' => 'required|string|exists:clientes,id',
                'produto_id' => 'required|array',
                'produto_id.*.id' => 'required|integer|exists:produtos,id', // Valida cada produto
                'produto_id.*.quantity' => 'required|integer|min:1', // Valida a quantidade
                'categoria_id' => 'required|string|exists:categorias,id',
                'type' => 'required|string',
                'desconto' => 'nullable|numeric|min:0|max:100'
            ]);

            // Cria o pedido
            $pedido = $this->pedidoService->create($data);

            return response()->json($pedido, Response::HTTP_CREATED);
        } catch (\Exception $e) {
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



    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'vendedor_id' => 'nullable|integer|exists:users,id',
                'cliente_id' => 'nullable|integer|exists:clientes,id',
                'produto_id' => 'nullable|array|exists:produtos,id',
                'categoria_id' => 'nullable|integer|exists:categorias,id',
                'type' => 'nullable|string',
                'total' => 'nullable|numeric',
                'quantities' => 'nullable|array',
                'quantities.*' => 'nullable|integer|min:1',
                'selling_prices' => 'nullable|array',
                'selling_prices.*' => 'nullable|numeric|min:0.01'
            ], [
                // Mensagens de erro (mesmas que já havia)
            ]);

            // Atualiza o pedido
            $pedido = $this->pedidoService->update($id, $validatedData);

            if (!$pedido) {
                return response()->json(['error' => 'Pedido não encontrado'], 404);
            }

            // Atualiza os produtos do pedido
            if (isset($validatedData['produto_id'])) {
                // Remover todos os produtos antigos
                $pedido->produtos()->detach();

                // Adiciona os novos produtos
                foreach ($validatedData['produto_id'] as $index => $produtoId) {
                    $pedido->produtos()->attach($produtoId, [
                        'quantity' => $validatedData['quantities'][$index],
                        'selling_price' => $validatedData['selling_prices'][$index],
                    ]);
                }
            }

            return response()->json($pedido, 200);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao atualizar pedido'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
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
