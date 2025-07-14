<?php

namespace App\Http\Controllers\User;

use App\Actions\User\CreateUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Services\User\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    // Método para obter todos os usuários
    public function index()
    {
        $users = $this->userService->getAll();
        return response()->json($users);
    }

    // Método para criar usuário dentro da loja
    public function store(StoreUserRequest $request, CreateUser $createUser)
    {
        try {
            
            $data = $request->validated();
            $user = $createUser->execute($data);

            return response()->json([
                'message' => 'Cadastro realizado com sucesso',
                'user' => $user,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Erro no signup: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // Método para obter um usuário por ID
    public function show($id)
    {
        $user = $this->userService->getById($id);
        return response()->json($user);
    }

    // Método para atualizar um usuário
    public function update(string $id, Request $request)
    {
        $data = $request->all();
        $user = $this->userService->update($id, $data);
        return response()->json($user);
    }

    //Edição de usuário
    public function edit(string $id, Request $request)
    {
        $data = $request->all();
        $user = $this->userService->update($id, $data);
        return response()->json($user);
    }

    //deleta usuário
    public function delete(string $id)
    {
        $user = $this->userService->delete($id);
        return response()->json($user);
    }

    // Método para obter todos os vendedores
    public function getVendedores()
    {
         try {
             $vendedores = $this->userService->getVendedores();
             return response()->json([
                 'vendedores' => $vendedores
             ]);
         } catch (\Exception $e) {
             return response()->json([
                 'error' => true,
                 'message' => 'Erro ao buscar vendedores: ' . $e->getMessage()
             ], 500);
         }
    }
}
