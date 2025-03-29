<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Buscar usuários com perfil de vendedor
    public function getVendedores()
    {
        try {
            $vendedores = User::where('role', 'vendedor')
                ->orWhere('role', 'admin') // Administradores também podem ser vendedores
                ->select('id', 'name', 'email', 'role')
                ->get();
                
            return response()->json($vendedores);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Erro ao buscar vendedores: ' . $e->getMessage()
            ], 500);
        }
    }
} 