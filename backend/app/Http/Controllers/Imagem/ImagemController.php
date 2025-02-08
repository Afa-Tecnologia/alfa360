<?php

namespace App\Http\Controllers\Imagem;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Imagem\ImagemService;
use Illuminate\Http\Response;

class ImagemController extends Controller
{
    protected $imagemService;

    public function __construct(ImagemService $imagemService)
    {
        $this->imagemService = $imagemService;
    }

    // Método para obter todos os variantes
    public function index()
    {
        $imagens = $this->imagemService->getAll();
        return response()->json(
            $imagens, 
            Response::HTTP_OK, 
            [], 
            JSON_UNESCAPED_SLASHES
        );
    }

    // Método para criar clientes
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'variante_id' => 'required|exists:variantes,id',
                'url' => 'required|string',


            ]); // Obtém dados validados
            $imagem = $this->imagemService->create($data);
            return response()->json(
                $imagem, 
                Response::HTTP_CREATED, 
                [], 
                JSON_UNESCAPED_SLASHES
            );
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar imagen',
                'message' => $e->getMessage(), // Exibe o erro original
                'trace' => $e->getTraceAsString(), // Opcional: exibe o rastreamento
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para obter um cliente por ID
    public function show($id)
    {
        $imagem = $this->imagemService->getById($id);

        if (!$imagem) {
            return response()->json(
                ['error' => 'Imagem não encontrado'],
                Response::HTTP_NOT_FOUND
            );
        }

        return response()->json($imagem);
    }


    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'variante_id' => 'nullable|exists:variantes,id',
                'url' => 'nullable|string|max:100',
            ]);

            $imagem = $this->imagemService->update($id, $validatedData);

            if (!$imagem) {
                return response()->json(['error' => 'Imagem não encontrado'], 404);
            }

            return response()->json($imagem, 200);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao atualizar imagem'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    // Método para deletar um variante
    public function delete(string $id)
    {
        try {
            $imagem = $this->imagemService->delete($id);

            if (!$imagem) {
                return response()->json(
                    ['error' => 'imagem não encontrada'],
                    Response::HTTP_NOT_FOUND
                );
            }

            return response()->json(
                ['message' => 'imagem deletado com sucesso'],
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao deletar imagem'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
