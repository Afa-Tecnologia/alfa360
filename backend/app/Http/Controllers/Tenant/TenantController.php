<?php

namespace App\Http\Controllers\Tenant;

use App\Actions\Tenant\CreateTenant;
use App\Actions\Tenant\DeleteTenant;
use App\Actions\Tenant\UpdateTenant;
use App\Models\Tenant;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreTenantRequest;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all tenants
        $tenants = Tenant::all();

        // Return a response or view with the tenants
        return response()->json($tenants);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTenantRequest $request, CreateTenant $createTenant)
    {
        try {
            // Validate and create the tenant
            $data = $request->validated();
            $tenant = $createTenant->execute($data);
            // Return a success response with the created tenant
            return response()->json([
                'message' => 'Tenant created successfully.',
                'tenant' => $tenant
            ], 201);
        } catch (\Exception $e) {
            // Handle any exceptions that occur during tenant creation
            return response()->json(['error' => $e->getMessage()], 400);
        }
      
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Fetch the tenant by ID
        $tenant = Tenant::find($id);

        // Check if tenant exists
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found.'], 404);
        }

        // Return a response with the tenant data
        return response()->json($tenant);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, UpdateTenant $updateTenant)
    {
        $tenant = Tenant::find($id);
        $updateTenant->execute($tenant, $request->all());
        return response()->json([
            'message' => 'Tenant atualizado com sucesso.',
            'tenant' => $tenant
        ], 200); 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id, DeleteTenant $deleteTenant)
    {
        $tenant = Tenant::find($id);
        
        if (!$tenant) {
            return response()->json(['error' => 'Tenant não encontrado.'], 404);
        }

        try {
            $deleteTenant->execute($tenant);
            return response()->json(['message' => 'Tenant deletado com sucesso.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
