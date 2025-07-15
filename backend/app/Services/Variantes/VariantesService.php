<?php

namespace App\Services\Variantes;

use App\Actions\Atributo\UpdateAtributosVariante;
use App\Models\Variantes;
use Exception;
use Illuminate\Http\Response;

class VariantesService
{
    // Método para criar um novo Produto
    public function create(array $data)
    {
        try{
            return Variantes::create($data);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar produto', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Método para criar novas Variantes associadas a um Produto
    public function createVariantWithProductId($productId, array $data)
    {
        $createdVariants = []; // Array para armazenar as variantes criadas
        try {
            foreach ($data as $variant) {
                $variant['produto_id'] = $productId;
                $createdVariant = Variantes::create($variant); // Cria a variante individualmente
                $createdVariants[] = $createdVariant; // Adiciona a variante criada ao array
            }
            return $createdVariants; // Retorna todas as variantes criadas
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao criar variantes', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function getAll()
    {
        return Variantes::all();
    }

    public function getById($id)
    {
        return Variantes::with('atributos')->findOrFail($id);
    }

    public function getClientesPorCategoria($id)
    {
        return Variantes::where('categoria_id', '=', $id)->get();
    }

    public function update($variantId, $data)
    {
        $variant = Variantes::findOrFail($variantId);
        $variant->update($data);
        return $variant;
    }
    

    public function updateOrSyncAttributesByCodeOrId(int $produtoId, array $variantDataList)
{
    $updatedVariants = [];

    foreach ($variantDataList as $variantData) {
        // Prioriza ID se vier no payload, senão usa o código
        $variant = null;

        if (isset($variantData['id'])) {
            $variant = Variantes::where('produto_id', $produtoId)
                ->where('id', $variantData['id'])
                ->first();
        } elseif (isset($variantData['code'])) {
            $variant = Variantes::where('produto_id', $produtoId)
                ->where('code', $variantData['code'])
                ->first();
        }

        // Se a variante for encontrada, atualiza atributos se existirem no payload
        if ($variant && isset($variantData['atributos'])) {
            app(UpdateAtributosVariante::class)->handle($variant, $variantData['atributos']);
            $updatedVariants[] = $variant;
        }
    }

    return $updatedVariants;
}

    

    // Método para excluir um usuário
    public function delete($id)
    {
        $variante = Variantes::find($id);
        if ($variante) {
            $variante->delete();
        }
        return $variante;
    }
}