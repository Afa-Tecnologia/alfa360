<?php

namespace App\Http\Controllers\Produtos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Produtos\ProdutoService;
use App\Http\Requests\StoreProdutoRequest;

use App\Jobs\SyncProductToWooCommerce;
use App\Services\Woocommerce\WoocommerceService;

class ProdutoController extends Controller
{
    protected $produtoService;
    protected $woocommerceService;

    public function __construct(ProdutoService $produtoService, WoocommerceService $woocommerceService)
    {
        
        $this->produtoService = $produtoService;
        $this->woocommerceService = $woocommerceService;
    }

    // Método para obter todos os produtos
    public function index()
    {
        $produtos = $this->produtoService->getAll();
        return response()->json(
            $produtos, 
            Response::HTTP_OK, 
            [], 
            JSON_UNESCAPED_SLASHES
        );
    }

    // Método para criar produtos
    public function store(StoreProdutoRequest $request)
    {
        try {
            $data = $request->validated(); // Obtém dados validados
            $produto = $this->produtoService->create($data);

            //Mapeamento dos campos do wocoommerce
            $woocommerceData = [
                'name' => $data->name,
                'description' => $data->description,
                'regular_price' => $data->selling_price,
                'stock_quantity'=> $data->quantity
            ];


            return response()->json($produto, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar produto',
                'message' => $e->getMessage(), // Exibe o erro original
                'trace' => $e->getTraceAsString(), // Opcional: exibe o rastreamento
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para obter um produto por ID
    public function show($id)
    {
        $produto = $this->produtoService->getById($id);

        if (!$produto) {
            return response()->json(
                ['error' => 'Produto não encontrado'],
                Response::HTTP_NOT_FOUND
            );
        }

        return response()->json($produto);
    }

    // Método para obter um produto pelo nome
    public function findByCategory($id)
    {

        $produtos = $this->produtoService->getProdutoPorCategoria($id);
        if (!$produtos) {
            return response()->json(
                ['error' => 'O parâmetro "id" é obrigatório ou categoria inexistente'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return response()->json($produtos);
    }

    // Método para obter um produto pelo nome
    public function indexVariantes($id)
    {

        $produtos = $this->produtoService->getProdutoPorCategoria($id);
        if (!$produtos) {
            return response()->json(
                ['error' => 'O parâmetro "id" é obrigatório ou categoria inexistente'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return response()->json($produtos);
    }


    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:255',
                'purchase_price' => 'nullable|numeric',
                'selling_price' => 'nullable|numeric',
                'quantity' => 'nullable|integer',
                'categoria_id' => 'nullable|exists:categorias,id',
            ]);

            $produto = $this->produtoService->update($id, $validatedData);

            if (!$produto) {
                return response()->json(['error' => 'Produto não encontrado'], 404);
            }

            return response()->json($produto, 200);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao atualizar produto'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    // Método para deletar um produto
    public function delete(string $id)
    {
        try {
            $produto = $this->produtoService->delete($id);

            if (!$produto) {
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
