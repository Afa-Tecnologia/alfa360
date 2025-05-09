<?php
namespace App\Services\Produtos;

use App\Models\Produto;
use App\Services\Variantes\VariantesService;
use Illuminate\Support\Facades\DB;
use App\Services\EstoqueService;
class ProdutoService
{
    protected $varianteService;
    protected $estoqueService;
    public function __construct(VariantesService $varianteService, EstoqueService $estoqueService)
    {
        $this->varianteService = $varianteService;
        $this->estoqueService = $estoqueService;
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
        return DB::transaction(function () use ($data) {
            
            $produto = Produto::create($data);
            $stock = 0;

            if (!empty($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variantData['produto_id'] = $produto->id;
                    $this->varianteService->create($variantData);
                    $stock += $variantData['quantity'];
                }
            }
            $produto->quantity = $stock;
            $produto->save();

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
                    try {
                        $this->varianteService->update($variantData['id'], $variantData);
                    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                        $variantData['produto_id'] = $produto->id;
                        $this->varianteService->create($variantData);
                    }
                } else {
                    $variantData['produto_id'] = $produto->id;
                    $this->varianteService->create($variantData);
                }
            }
        }
        $this->estoqueService->atualizarEstoqueProduto($produto->id);
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

    public function batchDelete(array $ids)
    {
        try {
            foreach ($ids as $id) {
                $produto = Produto::find($id);
                if ($produto) {
                    $produto->variants()->delete();
                    $produto->delete();
                }
                
            }
            return ['message' => 'Produtos deletados com sucesso'];
        } catch (\Exception $e) {
            return ['error' => 'Erro ao deletar produtos', 'message' => $e->getMessage()];
        }
    }
    
    public function findByBarcode($code)
    {
        return Produto::with('variants')
            ->where('code', $code)
            ->first();
    }
}