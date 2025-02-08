<?php

namespace App\Http\Controllers\Clientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Clientes\ClientesService;

class ClientesController extends Controller
{
    protected $clienteService;

    public function __construct(ClientesService $clienteService)
    {
        $this->clienteService = $clienteService;
    }

    // Método para obter todos os clientes
    public function index()
    {
        $clientes = $this->clienteService->getAll();
        return response()->json($clientes);
    }

    // Método para criar clientes
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required |string|max:100',
                'last_name' => 'required|string|max:100',
                'email'=> 'nullable',
                'cpf' => 'nullable',
                'phone' => 'required',
                'adress' => 'required',
                'state' => 'required',
                'cep' => 'required',
                'city' => 'required',
                'date_of_birth' => 'required'

        ]); // Obtém dados validados
            $cliente = $this->clienteService->create($data);
            return response()->json($cliente, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar cliente',
                'message' => $e->getMessage(), // Exibe o erro original
                'trace' => $e->getTraceAsString(), // Opcional: exibe o rastreamento
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para obter um cliente por ID
    public function show($id)
    {
        $cliente = $this->clienteService->getById($id);

        if (!$cliente) {
            return response()->json(
                ['error' => 'Cliente não encontrado'],
                Response::HTTP_NOT_FOUND
            );
        }

        return response()->json($cliente);
    }


    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'nullable|string|max:100',
                'last_name' => 'nullable|string|max:100',
                'email'=> 'nullable',
                'cpf' => 'nullable',
                'phone' => 'nullable',
                'adress' => 'nullable',
                'state' => 'nullable',
                'cep' => 'nullable',
                'city' => 'nullable',
                'date_of_birth' => 'nullable'
            ]);

            $cliente = $this->clienteService->update($id, $validatedData);

            if (!$cliente) {
                return response()->json(['error' => 'Cliente não encontrado'], 404);
            }

            return response()->json($cliente, 200);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao atualizar cliente'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    // Método para deletar um cliente
    public function delete(string $id)
    {
        try {
            $cliente = $this->clienteService->delete($id);

            if (!$cliente) {
                return response()->json(
                    ['error' => 'Cliente não encontrado'],
                    Response::HTTP_NOT_FOUND
                );
            }

            return response()->json(
                ['message' => 'Cliente deletado com sucesso'],
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Erro ao deletar Cliente'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
