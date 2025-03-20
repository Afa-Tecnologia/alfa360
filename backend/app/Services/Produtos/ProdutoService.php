<?php
namespace App\Services\Produtos;

use App\Models\Produto;
use App\Services\Variantes\VariantesService;
use Illuminate\Support\Facades\DB;

class ProdutoService
{
    protected $varianteService;
    public function __construct(VariantesService $varianteService)
    {
        $this->varianteService = $varianteService;
        
    }
    public function getAll()
    {
        return Produto::with('variants')->get();
    }

    public function getById($id)
    {
        return Produto::with('variants')->find($id);
    }

    public function create(array $data)
    {
        // echo response()->json($data['variants']);
        return DB::transaction(function () use ($data) {
            
            $produto = Produto::create($data);

            if (!empty($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variantData['produto_id'] = $produto->id;
                    $this->varianteService->create($variantData);
                }
            }

            return $produto->load('variants');
        });

        
    }
    
    public function update($id, array $data)
    {
        $produto = Produto::findOrFail($id);
        $produto->update($data);
    
        if (isset($data['variants']) && is_array($data['variants'])) {
            foreach ($data['variants'] as $variantData) {
                if (isset($variantData['id'])) {
                    $this->varianteService->update($variantData['id'], $variantData);
                } else {
                    $this->varianteService->create($produto->id, $variantData);
                }
            }
        }
    
        return $produto->load('variants');
    }
    

    public function delete($id)
    {
        $produto = Produto::findOrFail($id);
    
        foreach ($produto->variants as $variant) {
            $this->varianteService->delete($variant->id);
        }
    
        if (!$produto->delete()) {
            throw new \Exception('Erro ao deletar o produto');
        }
    
        return ['message' => 'Produto deletado com sucesso'];
    }
}