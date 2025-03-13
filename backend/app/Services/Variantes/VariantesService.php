<?php

namespace App\Services\Variantes;
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


    // Método para obter todos os usuários
    public function getAll()
    {
        return Variantes::all();
    }

    // Método para obter um usuário por ID
    public function getById($id)
    {
        return Variantes::with('imagens')->findOrFail($id);
    }

    public function getClientesPorCategoria($id)
    {
        return Variantes::where('categoria_id', '=', $id)->get();
    }

    public function update($variantId, $data)
    {
        // Encontrar a variante ou lançar exceção
        $variant = Variantes::findOrFail($variantId);
    
        // Verifica se 'images' foi enviado e é um array
        if (isset($data['images']) && is_array($data['images'])) {
            // Pega as imagens existentes e garante que seja um array
            $existingImages = is_string($variant->images) ? json_decode($variant->images, true) : (is_array($variant->images) ? $variant->images : []);
    
            // Mescla imagens novas com as existentes
            $data['images'] = json_encode(array_merge($existingImages, $data['images']), JSON_UNESCAPED_SLASHES);
        } elseif (isset($data['images']) && is_string($data['images'])) {
            // Se o frontend enviar diretamente como string JSON, apenas mantém
            $data['images'] = json_encode(json_decode($data['images'], true), JSON_UNESCAPED_SLASHES);
        }
    
        // Atualizar a variante com os novos dados
        $variant->update($data);
    
        return $variant;
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
