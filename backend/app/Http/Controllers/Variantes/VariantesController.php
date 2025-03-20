<?php

namespace App\Http\Controllers\Variantes;

use App\Http\Controllers\Controller;
use App\Models\Variantes;
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
        $variants = Variantes::all()->map(function ($variant) {
            $variant->images = json_decode($variant->images, true); // ✅ Transforma JSON de volta para array
            return $variant;
        });

        return response()->json(["variante" => $variants]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'name' => 'required|string',
            'type' => 'required|string',
            'color' => 'required|string',
            'size' => 'required|string',
            'quantity' => 'required|integer',
            'active' => 'boolean',
            'images' => 'array',  // ✅ Confirma que images é um array
            'images.*' => 'url'   // ✅ Confirma que cada imagem é uma URL válida
        ]);

        $variant = Variantes::create([
            'produto_id' => $request->produto_id,
            'name' => $request->name,
            'type' => $request->type,
            'color' => $request->color,
            'size' => $request->size,
            'quantity' => $request->quantity,
            'active' => $request->active ?? true,
            'images' => json_encode($request->images) // ✅ Salva o array como JSON
        ]);

        return response()->json($variant, 201);
    }


    // Método para obter um cliente por ID
    public function show($id)
    {
        $variante = $this->varianteService->getById($id);
        $variante->images = json_decode($variante->images, true);
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
        $variant = Variantes::findOrFail($id);
    
        $request->validate([
            'name' => 'sometimes|string',
            'type' => 'sometimes|string',
            'color' => 'sometimes|string',
            'size' => 'sometimes|string',
            'quantity' => 'sometimes|integer',
            'active' => 'boolean',
            'images' => 'sometimes|array',
            'images.*' => 'url'
        ]);
    
        $variant->update([
            'name' => $request->name ?? $variant->name,
            'type' => $request->type ?? $variant->type,
            'color' => $request->color ?? $variant->color,
            'size' => $request->size ?? $variant->size,
            'quantity' => $request->quantity ?? $variant->quantity,
            'active' => $request->active ?? $variant->active,
            'images' => $request->has('images') ? json_encode($request->images) : $variant->images
        ]);
    
        return response()->json($variant);
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
