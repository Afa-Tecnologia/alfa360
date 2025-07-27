<?php
namespace App\Services\Produtos;

use App\Actions\Atributo\AssignAtributoVariante;
use App\Models\Produto;
use App\Models\Variantes;
use App\Services\Variantes\VariantesService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\EstoqueService;
use App\Traits\ServiceCacheable;
use Illuminate\Http\Request;

class ProdutoService
{
    use ServiceCacheable;
    protected string $prefix = 'produto';
    
    protected $varianteService;
    protected $estoqueService;
    public function __construct(VariantesService $varianteService, EstoqueService $estoqueService)
    {
        $this->varianteService = $varianteService;
        $this->estoqueService = $estoqueService;
    }
    public function getAll(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $query = $request->input('query');
        $categoria_id = $request->input('categoria_id');

        $produtosQuery = Produto::with('variants.atributos');

        // Aplicar filtro de busca se fornecido
        if (!empty($query)) {
            $produtosQuery->where(function ($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%')
                  ->orWhere('code', 'like', '%' . $query . '%')
                  ->orWhere('brand', 'like', '%' . $query . '%')
                  ->orWhereHas('variants', function ($variantQuery) use ($query) {
                      $variantQuery->where('name', 'like', '%' . $query . '%')
                                  ->orWhere('code', 'like', '%' . $query . '%');
                  });
            });
        }

        // Aplicar filtro de categoria se fornecido
        if (!empty($categoria_id) && $categoria_id !== 'all') {
            $produtosQuery->where('categoria_id', $categoria_id);
        }

        return $produtosQuery->paginate($perPage);
    }


    public function getById($id)
    {
        return Produto::with('variants.atributos')->find($id);
    }

    public function create(array $data, )
    {
        return DB::transaction(function () use ($data) {
            
            $produto = Produto::create($data);
            $stock = 0;

            if (!empty($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variantData['produto_id'] = $produto->id;
                    $createdVariant = $this->varianteService->create($variantData);
                    $stock += $variantData['quantity'];

                    //Cria os atributos
                    if(!empty($variantData['atributos'])){
                        $attVariante = new AssignAtributoVariante;
                        $attVariante->execute($variantData['atributos'], $createdVariant->id);
                    }
                }
            }
            $produto->quantity = $stock;
            $produto->save();

            return $produto->load('variants.atributos');
        });

        
    }
    

    public function update($id, array $data)
    {
        $produto = Produto::findOrFail($id);
        $produto->update($data);

        $idsRecebidos = [];

        if (isset($data['variants']) && is_array($data['variants'])) {
            foreach ($data['variants'] as $variantData) {
                if (isset($variantData['id'])) {
                    try {
                        $this->varianteService->update($variantData['id'], $variantData);
                        $idsRecebidos[] = $variantData['id'];
                    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                        $variantData['produto_id'] = $produto->id;
                        $novaVariante = $this->varianteService->create($variantData);
                        $idsRecebidos[] = $novaVariante->id;

                        // ✅ Associa atributos à nova variante
                        if (isset($variantData['atributos']) && is_array($variantData['atributos'])) {
                            app(\App\Actions\Atributo\UpdateAtributosVariante::class)
                                ->handle($novaVariante, $variantData['atributos']);
                        }
                    }
                } else {
                    $variantData['produto_id'] = $produto->id;
                    $novaVariante = $this->varianteService->create($variantData);
                    $idsRecebidos[] = $novaVariante->id;

                    // ✅ Associa atributos à nova variante
                    if (isset($variantData['atributos']) && is_array($variantData['atributos'])) {
                        app(\App\Actions\Atributo\UpdateAtributosVariante::class)
                            ->handle($novaVariante, $variantData['atributos']);
                    }
                }
            }

            // ❌ Remove variantes não presentes no payload
            $produto->variants()->whereNotIn('id', $idsRecebidos)->delete();

            // ✅ Atualiza atributos de variantes existentes
            $this->varianteService->updateOrSyncAttributesByCodeOrId($produto->id, $data['variants']);
        }

        $this->estoqueService->atualizarEstoqueProduto($produto->id);

        return $produto->load('variants.atributos');
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
        return Produto::with('variants.atributos')
            ->where('code', $code)
            ->first();
    }

    public function findVarianteByBarcode($code)
    {
        return Variantes::with('produto')
            ->where('code', $code)
            ->first();
    }

    public function getByName($name)
    {
        return Produto::with('variants.atributos')
            ->where('name', 'like', '%' . $name . '%')
            ->get();
    }

    public function search($query)
    {
        if (empty($query)) {
            return Produto::with('variants.atributos')->get();
        }
        return Produto::with('variants.atributos')
            ->where('name', 'like', '%' . $query . '%')
            ->orWhere('code', 'like', '%' . $query . '%')
            ->orWhere('brand', 'like', '%' . $query . '%')
            ->orWhereHas('variants', function ($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%')
                  ->orWhere('code', 'like', '%' . $query . '%');
            })
            ->orWhere('category', 'like', '%' . $query . '%')
            ->get();
    }
}