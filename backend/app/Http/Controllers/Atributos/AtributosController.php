<?php

namespace App\Http\Controllers\Atributos;

use App\Actions\Atributo\ListAtributosByTipoDeNegocio;
use App\Http\Controllers\Controller;
use App\Models\Atributo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AtributosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Atributo::all();
    }

    public function indexByTipoDeNegocio (ListAtributosByTipoDeNegocio $listAtributosByTipoDeNegocio){
        return $listAtributosByTipoDeNegocio->execute();
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id)
    {
        //
    }
}
