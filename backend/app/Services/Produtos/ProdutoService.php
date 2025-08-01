<?php
namespace App\Services\Produtos;

use App\Actions\Atributo\AssignAtributoVariante;
use App\Models\Produto;
use App\Models\Variantes;
use App\Services\Variantes\VariantesService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\EstoqueService;
use App\Services\CacheService;
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

        $cacheKey = "produtos_list_{$perPage}_{$query}_{$categoria_id}";

        return CacheService::rememberProduct($cacheKey, function () use ($request, $perPage, $query, $categoria_id) {
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
        });
    }


    public function getById($id)
    {
        $cacheKey = "produto_{$id}";
        
        return CacheService::rememberProduct($cacheKey, function () use ($id) {
            return Produto::with('variants.atributos')->find($id);
        });
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            Log::info('Produto create iniciado', ['timestamp' => now()]);
            
            $produto = Produto::create($data);
            $stock = 0;
            $variantsToCreate = [];
            $atributosToAttach = [];

            if (!empty($data['variants']) && is_array($data['variants'])) {
                // Preparar dados em lote
                foreach ($data['variants'] as $variantData) {
                    $variantData['produto_id'] = $produto->id;
                    $variantsToCreate[] = $variantData;
                    $stock += $variantData['quantity'] ?? 0;
                }
                
                // Criar variantes em lote
                $createdVariants = [];
                foreach ($variantsToCreate as $variantData) {
                    $createdVariant = $this->varianteService->create($variantData);
                    $createdVariants[] = $createdVariant;
                    
                    // Preparar atributos para processamento em lote
                    if (!empty($variantData['atributos'])) {
                        $atributosToAttach[] = [
                            'variant_id' => $createdVariant->id,
                            'atributos' => $variantData['atributos']
                        ];
                    }
                }
                
                // Processar atributos em lote
                $this->processarAtributosEmLote($atributosToAttach);
            }

            $produto->quantity = $stock;
            $produto->save();

            // Invalidar cache de produtos
            CacheService::flushProducts();

            $duration = microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'];
            Log::info('Produto create finalizado', ['duration' => $duration]);

            return $produto->load('variants.atributos');
        });
    }

    private function processarAtributosEmLote(array $atributosToAttach)
    {
        if (empty($atributosToAttach)) {
            return;
        }

        $pivotData = [];
        
        foreach ($atributosToAttach as $item) {
            foreach ($item['atributos'] as $atributo) {
                $pivotData[] = [
                    'variante_id' => $item['variant_id'],
                    'atributo_id' => $atributo['atributo_id'],
                    'valor' => $atributo['valor']
                ];
            }
        }
        
        // Insert em lote se houver dados
        if (!empty($pivotData)) {
            DB::table('variantes_atributos')->insert($pivotData);
        }
    }
    

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            Log::info('Produto update iniciado', ['produto_id' => $id, 'timestamp' => now()]);
            
            $produto = Produto::findOrFail($id);
            $produto->update($data);

            if (isset($data['variants']) && is_array($data['variants'])) {
                $this->processarVariantesEmLote($produto->id, $data['variants']);
            }

            // Invalidar cache de produtos
            CacheService::flushProducts();

            $duration = microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'];
            Log::info('Produto update finalizado', ['produto_id' => $id, 'duration' => $duration]);

            return $produto->load('variants.atributos');
        });
    }

    private function processarVariantesEmLote($produtoId, array $variants)
    {
        $toUpdate = [];
        $toCreate = [];
        $idsRecebidos = [];
        
        // Classificar operações
        foreach ($variants as $variant) {
            if (isset($variant['id'])) {
                $toUpdate[] = $variant;
                $idsRecebidos[] = $variant['id'];
            } else {
                $variant['produto_id'] = $produtoId;
                $toCreate[] = $variant;
            }
        }
        
        // Executar operações em lote
        if (!empty($toCreate)) {
            foreach ($toCreate as $variantData) {
                $createdVariant = $this->varianteService->create($variantData);
                $idsRecebidos[] = $createdVariant->id;
                
                // Processar atributos em lote
                if (isset($variantData['atributos']) && is_array($variantData['atributos'])) {
                    $this->processarAtributosEmLote([
                        [
                            'variant_id' => $createdVariant->id,
                            'atributos' => $variantData['atributos']
                        ]
                    ]);
                }
            }
        }
        
        if (!empty($toUpdate)) {
            foreach ($toUpdate as $variant) {
                $this->varianteService->update($variant['id'], $variant);
                
                // Processar atributos em lote
                if (isset($variant['atributos']) && is_array($variant['atributos'])) {
                    app(\App\Actions\Atributo\UpdateAtributosVariante::class)
                        ->handle(Variantes::find($variant['id']), $variant['atributos']);
                }
            }
        }
        
        // Remover variantes não presentes no payload
        if (!empty($idsRecebidos)) {
            Variantes::where('produto_id', $produtoId)
                ->whereNotIn('id', $idsRecebidos)
                ->delete();
        }
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