<?php

namespace App\Http\Controllers\Atributos;

use App\Actions\Atributo\ListAtributosByTipoDeNegocio;
use App\Actions\Atributo\UpdateAtributosVariante;
use App\Http\Controllers\Controller;
use App\Models\Atributo;
use App\Models\Variantes;
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
     * Cria atributos para uma variante de produto.
     * @param Request $request
     * @param int $varianteId
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, int $varianteId)
    {
        // $data = $request->validate([
        //     'atributo_id' => 'required|exists:atributos,id',
        //     'valor' => 'required|string|max:255',
        // ]);
    }
    
        
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }


    /**
     * Atualiza os atributos de uma variante.
     *
     * Valida e sincroniza os atributos de uma variante, impedindo duplicações no pivot,
     * atualizando os valores existentes, removendo os ausentes e inserindo os novos.
     *
     * @param \Illuminate\Http\Request $request A requisição HTTP com os dados.
     * @param string $id ID da variante.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            "atributos" => ["required", "array", function ($attribute, $value, $fail) {
                $ids = array_column($value, 'atributo_id');
                if (count($ids) !== count(array_unique($ids))) {
                    $fail("Os atributos não podem conter IDs duplicados.");
                }
            }],
            "atributos.*.atributo_id" => "required|exists:atributos,id",
            "atributos.*.valor" => "required|string|max:255"
        ], [
            "atributos.required" => "Os atributos são obrigatórios.",
            "atributos.*.atributo_id.required" => "O ID do atributo é obrigatório.",
            "atributos.*.atributo_id.exists" => "O atributo selecionado não existe.",
            "atributos.*.valor.required" => "O valor do atributo é obrigatório.",
            "atributos.*.valor.string" => "O valor do atributo deve ser uma string.",
            "atributos.*.valor.max" => "O valor do atributo não pode exceder 255 caracteres."
        ]);

        $updatedAttributes =  new UpdateAtributosVariante;
        $updatedAttributes->execute($validated['atributos'], $id);
        
        return response()->json(['message' => 'Atributos atualizados com sucesso.'], 200);
    }



    

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id)
    {
        //
    }
}
