<?php

namespace App\Http\Controllers\Variantes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Variantes\VariantesService;

class VariantesController extends Controller
{
    protected $varianteService;

    public function __construct(VariantesService $varianteService)
    {
        $this->varianteService = $varianteService;
    }

    // Método para obter todos os variantes
    public function index()
    {
        $variantes = $this->varianteService->getAll();
        return response()->json($variantes);
    }

    // Método para criar clientes
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'produto_id' => 'required|exists:produtos,id',
                'name' => 'required|string|max:100',
                'color' => 'required|string',
                'size' => 'required|string',
                'price' => 'required',
                'stock'=> 'required',
                'active'=> 'required|boolean',
                'type' => 'required|string'


            ]); // Obtém dados validados
            $variante = $this->varianteService->create($data);
            return response()->json($variante, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar variante',
                'message' => $e->getMessage(), // Exibe o erro original
                'trace' => $e->getTraceAsString(), // Opcional: exibe o rastreamento
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para obter um cliente por ID
    public function show($id)
    {
        $variante = $this->varianteService->getById($id);

        if (!$variante) {
            return response()->json(
                ['error' => 'Variante não encontrado'],
                Response::HTTP_NOT_FOUND
            );
        }

        return response()->json($variante);
    }


    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'produto_id' => 'nullable|exists:produtos,id',
                'name' => 'nullable|string|max:100',
                'color' => 'nullable|string',
                'size' => 'nullable|string',
                'price' => 'nullable|decimal',
                'stock'=> 'nullable',
                'active'=> 'nullable|boolean',
                'type' => 'nullable|string'
            ]);

            $variante = $this->varianteService->update($id, $validatedData);

            if (!$variante) {
                return response()->json(['error' => 'Variante não encontrado'], 404);
            }

            return response()->json($variante, 200);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao atualizar variante'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    // Método para deletar um variante
    public function delete(string $id)
    {
        try {
            $variante = $this->varianteService->delete($id);

            if (!$variante) {
                return response()->json(
                    ['error' => 'variante não encontrado'],
                    Response::HTTP_NOT_FOUND
                );
            }

            return response()->json(
                ['message' => 'variante deletado com sucesso'],
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao deletar variante'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
