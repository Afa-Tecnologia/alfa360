<?php
namespace App\Http\Controllers\Produtos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Produtos\ProdutoService;
use App\Http\Requests\StoreProdutoRequest;
use App\Services\Variantes\VariantesService;
use App\Services\ApiResponseService;

class ProdutoController extends Controller
{
    protected $produtoService;
    protected $varianteService;

    public function __construct(ProdutoService $produtoService, VariantesService $variantService)
    {
        $this->produtoService = $produtoService;
        $this->varianteService = $variantService;

    }

    public function index(Request $request)
    {
        return response()->json($this->produtoService->getAll($request), Response::HTTP_OK);
    }

    public function store(StoreProdutoRequest $request)
    {
        try {
            $productValidated = $request->validate([
                'name' => 'required|string',
                'description' => 'required|string',
                'tipo_de_produto_id' => 'required|exists:tipo_de_produto,id',
                'categoria_id' => 'required|exists:categorias,id',
                'brand' => 'nullable|string',
                'selling_price' => 'required|numeric',
                'purchase_price' => 'required|numeric',
                'quantity' => 'required|integer',
                'variants' => 'nullable'
            ],
            [
                'name.required' => 'O nome do produto é obrigatório.',
                'description.required' => 'A descrição do produto é obrigatória.',
                'tipo_de_produto_id.required' => 'O tipo do produto é obrigatório.',
                'tipo_de_produto_id.exists' => 'O tipo de produto selecionado não existe.',
                'categoria_id.required' => 'A categoria é obrigatória.',
                'categoria_id.exists' => 'A categoria selecionada não existe.',
                'selling_price.required' => 'O preço de venda é obrigatório.',
                'selling_price.numeric' => 'O preço de venda deve ser um número.',
                'purchase_price.required' => 'O preço de compra é obrigatório.',
                'purchase_price.numeric' => 'O preço de compra deve ser um número.',
                'quantity.required' => 'A quantidade é obrigatória.',
                'quantity.integer' => 'A quantidade deve ser um número inteiro.'
            ]);
            $produto = $this->produtoService->create($productValidated);

            return response()->json(['message' => 'Produto CRIADO com sucesso', 'produto'=> $produto], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao criar produto', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        $produto = $this->produtoService->getById($id);

        if (!$produto) {
            return response()->json(['error' => 'Produto não encontrado'], Response::HTTP_NOT_FOUND);
        }

        return ApiResponseService::json($produto);
    }

    public function update(Request $request, $id)
    {
        try {
            $productValidated = $request->validate([
                'name' => 'nullable|string',
                'description' => 'nullable|string',
                'tipo_de_produto_id' => 'nullable|exists:tipo_de_produto,id',
                'categoria_id' => 'nullable|exists:categorias,id',
                'brand' => 'nullable|string',
                'selling_price' => 'nullable|numeric',
                'purchase_price' => 'nullable|numeric',
                'quantity' => 'nullable|integer',
                'code' => 'nullable|string',
                'variants'=> 'nullable'
            ]);
            $produto = $this->produtoService->update($id, $productValidated);
            // $produto = $this->varianteService->update($id, $productValidated['variants']);

            if (!$produto) {
                return response()->json(['error' => 'Produto não encontrado'], Response::HTTP_NOT_FOUND);
            }
            
            return ApiResponseService::json(['message' => 'Produto ATUALIZADO com sucesso', 'produto'=> $produto], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar produto', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function delete($id)
    {
        if(!isset($id)) {
            return response()->json(['error' => 'ID do produto não informado'], Response::HTTP_BAD_REQUEST);
        }

        $searchProduto = $this->produtoService->getById($id);

        if(!$searchProduto) {
            return response()->json(['error' => 'Produto não encontrado'], Response::HTTP_NOT_FOUND);
        }

        try {
            return $this->produtoService->delete($id);
            return response()->json(['message' => 'Produto DELETADO com sucesso'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao deletar produto', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function batchDelete(Request $request)
    {
        $ids = $request->ids;
        if(!$ids) {
            return response()->json(['error' => 'IDs dos produtos não informados'], Response::HTTP_BAD_REQUEST);
        }
        return $this->produtoService->batchDelete($ids);
    }

    public function findByBarcode($code)
    {
        if (!$code) {
            return response()->json(
                ['error' => 'Código de barras não informado',
                
        ], Response::HTTP_BAD_REQUEST);
        }

        $produto = $this->produtoService->findByBarcode($code);
        
        if (!$produto) {
            // Se não encontrar o produto, tenta encontrar uma variante pelo código de barras
            $variante = $this->produtoService->findVarianteByBarcode($code);
            if ($variante) {
                return ApiResponseService::json($variante, Response::HTTP_OK);
            }
            return response()->json(
                [
                    'error' => 'Produto não encontrado com este código de barras',
                    'exists' => false
                ], Response::HTTP_NOT_FOUND);
        }
        
        return ApiResponseService::json($produto, Response::HTTP_OK);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        $produtos = $this->produtoService->search($query);
        return ApiResponseService::json($produtos, Response::HTTP_OK);
    }
}