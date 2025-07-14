<?php

namespace App\Http\Controllers\Empresa;

use App\Actions\Empresa\CreateEmpresa;
use App\Actions\Empresa\DeleteEmpresa;
use App\Actions\Empresa\UpdateEmpresa;
use App\Http\Controllers\Controller;
use App\Http\Requests\Empresa\StoreEmpresaRequest;
use App\Models\Empresa;
use Exception;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all empresas
        $empresas = \App\Models\Empresa::all();

        // Return a response or view with the empresas
        return response()->json($empresas);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmpresaRequest $request, CreateEmpresa $createEmpresa)
    {
        try {
            // Validate and create the empresa
            $data = $request->validated();
            $empresa = $createEmpresa->execute($data);
            // Return a success response with the created empresa
            return response()->json([
                'message' => 'Empresa criada com sucesso.',
                'empresa' => $empresa
            ], 201);
        } catch (\Exception $e) {
            // Handle any exceptions that occur during empresa creation
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Empresa::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, UpdateEmpresa $updateEmpresa)
    {
        try {
            
            $data = $request->all();
            $empresa = Empresa::find($id);
            if(!$empresa) throw new Exception('Empresa não encontrada', 404);

            $empresa = $updateEmpresa->execute($empresa, $data);
            // Return a success response with the created empresa
            return response()->json([
                'message' => 'Empresa atualizada com sucesso.',
                'empresa' => $empresa
            ], 201);
        } catch (\Exception $e) {
            // Handle any exceptions that occur during empresa creation
            return response()->json(
                ['error' => 'NotFoundError',
                 'message' => $e->getMessage()
                ], $e->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(Request $request, string $id, DeleteEmpresa $deleteEmpresa)
    {
        try {

             $empresa = Empresa::find($id);
            if(!$empresa) throw new Exception('Empresa não encontrada', 404);
            
            $empresa = $deleteEmpresa->execute($empresa);
            // Return a success response with the created empresa
            return response()->json([
                'message' => 'Empresa deletada com sucesso.',
                'empresa' => $empresa
            ], 201);
        } catch (\Exception $e) {
            // Handle any exceptions that occur during empresa creation
            return response()->json(
                ['error' => 'NotFoundError',
                 'message' => $e->getMessage()
                ], $e->getCode());
        }
    }
}
