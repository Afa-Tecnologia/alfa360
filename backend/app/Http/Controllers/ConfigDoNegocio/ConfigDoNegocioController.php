<?php

namespace App\Http\Controllers\ConfigDoNegocio;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConfigDoNegocio\StoreConfigDoNegocioRequest;
use App\Http\Requests\ConfigDoNegocio\UpdateConfigDoNegocioRequest;
use App\Services\ConfigDoNegocio\ConfigDoNegocioService;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ConfigDoNegocioController extends Controller
{
    protected $configDoNegocioService;

    public function __construct(ConfigDoNegocioService $configDoNegocioService)
    {
        $this->configDoNegocioService = $configDoNegocioService;
    }

    /**
     * Exibe uma lista de todas as configurações de negócio.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $configsDoNegocio = $this->configDoNegocioService->getAll();
        return response()->json($configsDoNegocio);
    }

    /**
     * Armazena uma nova configuração de negócio.
     *
     * @param  \App\Http\Requests\ConfigDoNegocio\StoreConfigDoNegocioRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreConfigDoNegocioRequest $request)
    {
        try {
            $configDoNegocio = $this->configDoNegocioService->create($request->validated());

            return response()->json($configDoNegocio, HttpResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar configuração de negócio',
                'message' => $e->getMessage(),
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Exibe uma configuração de negócio específica.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $configDoNegocio = $this->configDoNegocioService->getById($id);
            
            if (!$configDoNegocio) {
                return response()->json([
                    'error' => 'Configuração de negócio não encontrada'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json($configDoNegocio);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar configuração de negócio',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Atualiza uma configuração de negócio específica.
     *
     * @param  \App\Http\Requests\ConfigDoNegocio\UpdateConfigDoNegocioRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateConfigDoNegocioRequest $request, $id)
    {
        try {
            $configDoNegocio = $this->configDoNegocioService->update($id, $request->validated());

            if (!$configDoNegocio) {
                return response()->json([
                    'error' => 'Configuração de negócio não encontrada'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json($configDoNegocio);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar configuração de negócio',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove uma configuração de negócio específica.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $deleted = $this->configDoNegocioService->delete($id);

            if (!$deleted) {
                return response()->json([
                    'error' => 'Configuração de negócio não encontrada'
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json(null, HttpResponse::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao excluir configuração de negócio',
                'message' => $e->getMessage()
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
} 