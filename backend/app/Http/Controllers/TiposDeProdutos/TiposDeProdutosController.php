<?php

namespace App\Http\Controllers\TiposDeProdutos;

use App\Http\Controllers\Controller;
use App\Http\Requests\TiposDeProdutos\StoreTiposDeProdutosRequest;
use App\Http\Requests\TiposDeProdutos\UpdateTiposDeProdutosRequest;
use App\Services\TiposDeProdutos\TiposDeProdutosService;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class TiposDeProdutosController extends Controller
{
    protected $tiposDeProdutosService;

    public function __construct(TiposDeProdutosService $tiposDeProdutosService)
    {
        $this->tiposDeProdutosService = $tiposDeProdutosService;
    }

    /**
     * Exibe uma lista de todos os tipos de produtos.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $tiposDeProdutos = $this->tiposDeProdutosService->getAll();
        return response()->json($tiposDeProdutos);
    }

    /**
     * Armazena um novo tipo de produto.
     *
     * @param  \App\Http\Requests\TiposDeProdutos\StoreTiposDeProdutosRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreTiposDeProdutosRequest $request)
    {
        try {
            $tipoDeProduto = $this->tiposDeProdutosService->create($request->validated());

            return response()->json($tipoDeProduto, HttpResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar tipo de produto',
                'message' => $e->getMessage(),
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Exibe um tipo de produto específico.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $tipoDeProduto = $this->tiposDeProdutosService->getById($id);
            
            if (!$tipoDeProduto) {
                return response()->json([
                    'error' => 'Tipo de produto não encontrado'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json($tipoDeProduto);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar tipo de produto',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Atualiza um tipo de produto específico.
     *
     * @param  \App\Http\Requests\TiposDeProdutos\UpdateTiposDeProdutosRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateTiposDeProdutosRequest $request, $id)
    {
        try {
            $tipoDeProduto = $this->tiposDeProdutosService->update($id, $request->validated());

            if (!$tipoDeProduto) {
                return response()->json([
                    'error' => 'Tipo de produto não encontrado'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json($tipoDeProduto);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar tipo de produto',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove um tipo de produto específico.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $deleted = $this->tiposDeProdutosService->delete($id);

            if (!$deleted) {
                return response()->json([
                    'error' => 'Tipo de produto não encontrado'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json(null, HttpResponse::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao excluir tipo de produto',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
} 