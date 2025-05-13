<?php

namespace App\Http\Controllers\TipoDeNegocios;

use App\Http\Controllers\Controller;
use App\Http\Requests\TipoDeNegocios\StoreTipoDeNegociosRequest;
use App\Http\Requests\TipoDeNegocios\UpdateTipoDeNegociosRequest;
use App\Services\TipoDeNegocios\TipoDeNegociosService;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class TipoDeNegociosController extends Controller
{
    protected $tipoDeNegociosService;

    public function __construct(TipoDeNegociosService $tipoDeNegociosService)
    {
        $this->tipoDeNegociosService = $tipoDeNegociosService;
    }

    /**
     * Exibe uma lista de todos os tipos de negócios.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $tiposDeNegocios = $this->tipoDeNegociosService->getAll();
        return response()->json($tiposDeNegocios);
    }

    /**
     * Armazena um novo tipo de negócio.
     *
     * @param  \App\Http\Requests\TipoDeNegocios\StoreTipoDeNegociosRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreTipoDeNegociosRequest $request)
    {
        try {
            $tipoDeNegocio = $this->tipoDeNegociosService->create($request->validated());

            return response()->json($tipoDeNegocio, HttpResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar tipo de negócio',
                'message' => $e->getMessage(),
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Exibe um tipo de negócio específico.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $tipoDeNegocio = $this->tipoDeNegociosService->getById($id);
            
            if (!$tipoDeNegocio) {
                return response()->json([
                    'error' => 'Tipo de negócio não encontrado'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json($tipoDeNegocio);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar tipo de negócio',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Atualiza um tipo de negócio específico.
     *
     * @param  \App\Http\Requests\TipoDeNegocios\UpdateTipoDeNegociosRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateTipoDeNegociosRequest $request, $id)
    {
        try {
            $tipoDeNegocio = $this->tipoDeNegociosService->update($id, $request->validated());

            if (!$tipoDeNegocio) {
                return response()->json([
                    'error' => 'Tipo de negócio não encontrado'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json($tipoDeNegocio);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar tipo de negócio',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove um tipo de negócio específico.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $deleted = $this->tipoDeNegociosService->delete($id);

            if (!$deleted) {
                return response()->json([
                    'error' => 'Tipo de negócio não encontrado'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json(null, HttpResponse::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao excluir tipo de negócio',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
} 