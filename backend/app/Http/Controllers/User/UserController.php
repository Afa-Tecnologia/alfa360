<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\UserService;
use Illuminate\Http\Request;


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

    // Método para criar usuário
    public function store(Request $request)
    {
        $data = $request->all();
        $user = $this->userService->create($data);
        return response()->json($user, 201);
    }

    // Método para obter um usuário por ID
    public function show($id)
    {
        $user = $this->userService->getById($id);
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
}
