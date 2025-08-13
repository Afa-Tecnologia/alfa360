<?php

namespace Tests\Unit;

use App\Services\Produtos\ProdutoService;
use App\Models\Produto;
use App\Models\Categoria;
use App\Models\TiposDeProdutos;
use App\Models\Variantes;
use App\Models\Atributo;
use App\Services\Variantes\VariantesService;
use App\Services\EstoqueService;
use App\Services\CacheService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;
use Mockery;

class ProdutoServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $produtoService;
    protected $varianteService;
    protected $estoqueService;
    protected $categoria;
    protected $tipoProduto;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock dos serviços dependentes
        $this->varianteService = Mockery::mock(VariantesService::class);
        $this->estoqueService = Mockery::mock(EstoqueService::class);
        
        // Criar dados de teste
        $this->categoria = Categoria::factory()->create(['name' => 'Eletrônicos']);
        $this->tipoProduto = TiposDeProdutos::factory()->create(['nome' => 'Produto Físico']);
        
        // Instanciar o serviço
        $this->produtoService = new ProdutoService($this->varianteService, $this->estoqueService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function pode_listar_produtos_com_paginacao()
    {
        // Arrange: Criar produtos de teste
        Produto::factory()->count(15)->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        $request = new Request(['per_page' => 10]);

        // Act: Listar produtos
        $result = $this->produtoService->getAll($request);

        // Assert: Verificar resultado
        $this->assertEquals(10, $result->count());
        $this->assertEquals(15, $result->total());
        $this->assertEquals(1, $result->currentPage());
    }

    /** @test */
    public function pode_filtrar_produtos_por_busca()
    {
        // Arrange: Criar produtos com nomes específicos
        Produto::factory()->create([
            'name' => 'iPhone 15 Pro',
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);
        
        Produto::factory()->create([
            'name' => 'Samsung Galaxy S24',
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        $request = new Request(['query' => 'iPhone']);

        // Act: Buscar produtos
        $result = $this->produtoService->getAll($request);

        // Assert: Verificar que retornou apenas o iPhone
        $this->assertEquals(1, $result->count());
        $this->assertEquals('iPhone 15 Pro', $result->first()->name);
    }

    /** @test */
    public function pode_filtrar_produtos_por_categoria()
    {
        // Arrange: Criar categorias e produtos
        $categoria2 = Categoria::factory()->create(['name' => 'Roupas']);
        
        Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);
        
        Produto::factory()->create([
            'categoria_id' => $categoria2->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        $request = new Request(['categoria_id' => $this->categoria->id]);

        // Act: Filtrar por categoria
        $result = $this->produtoService->getAll($request);

        // Assert: Verificar que retornou apenas produtos da categoria
        $this->assertEquals(1, $result->count());
        $this->assertEquals($this->categoria->id, $result->first()->categoria_id);
    }

    /** @test */
    public function pode_criar_produto_simples()
    {
        // Arrange: Dados do produto
        $produtoData = [
            'name' => 'Produto Teste',
            'description' => 'Descrição do produto teste',
            'purchase_price' => 50.00,
            'selling_price' => 100.00,
            'quantity' => 10,
            'brand' => 'Marca Teste',
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ];

        // Act: Criar produto
        $result = $this->produtoService->create($produtoData);

        // Assert: Verificar criação
        $this->assertInstanceOf(Produto::class, $result);
        $this->assertEquals('Produto Teste', $result->name);
        $this->assertEquals(100.00, $result->selling_price);
        $this->assertEquals(10, $result->quantity);
        $this->assertNotEmpty($result->code); // Código de barras gerado
    }

    /** @test */
    public function pode_criar_produto_com_variantes()
    {
        // Arrange: Criar atributos
        $atributoCor = Atributo::factory()->create(['name' => 'Cor']);
        $atributoTamanho = Atributo::factory()->create(['name' => 'Tamanho']);
        
        $produtoData = [
            'name' => 'Camiseta Básica',
            'description' => 'Camiseta básica de algodão',
            'purchase_price' => 15.00,
            'selling_price' => 30.00,
            'quantity' => 0,
            'brand' => 'Marca Teste',
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id,
            'variants' => [
                [
                    'name' => 'Camiseta Azul P',
                    'code' => 'CAM-AZUL-P',
                    'quantity' => 5,
                    'selling_price' => 30.00,
                    'atributos' => [
                        ['atributo_id' => $atributoCor->id, 'valor' => 'Azul'],
                        ['atributo_id' => $atributoTamanho->id, 'valor' => 'P']
                    ]
                ]
            ]
        ];

        // Mock do serviço de variantes
        $variante = Variantes::factory()->make(['id' => 1]);
        $this->varianteService->shouldReceive('create')
            ->once()
            ->andReturn($variante);

        // Act: Criar produto com variantes
        $result = $this->produtoService->create($produtoData);

        // Assert: Verificar criação
        $this->assertInstanceOf(Produto::class, $result);
        $this->assertEquals('Camiseta Básica', $result->name);
        $this->assertEquals(5, $result->quantity); // Soma das variantes
    }

    /** @test */
    public function pode_obter_produto_por_id()
    {
        // Arrange: Criar produto
        $produto = Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        // Act: Buscar produto por ID
        $result = $this->produtoService->getById($produto->id);

        // Assert: Verificar resultado
        $this->assertInstanceOf(Produto::class, $result);
        $this->assertEquals($produto->id, $result->id);
        $this->assertEquals($produto->name, $result->name);
    }

    /** @test */
    public function pode_atualizar_produto()
    {
        // Arrange: Criar produto
        $produto = Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        $dadosAtualizacao = [
            'name' => 'Produto Atualizado',
            'selling_price' => 150.00,
            'quantity' => 25
        ];

        // Act: Atualizar produto
        $result = $this->produtoService->update($produto->id, $dadosAtualizacao);

        // Assert: Verificar atualização
        $this->assertInstanceOf(Produto::class, $result);
        $this->assertEquals('Produto Atualizado', $result->name);
        $this->assertEquals(150.00, $result->selling_price);
        $this->assertEquals(25, $result->quantity);
    }

    /** @test */
    public function pode_atualizar_produto_com_variantes()
    {
        // Arrange: Criar produto com variante
        $produto = Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);
        
        $variante = Variantes::factory()->create([
            'produto_id' => $produto->id,
            'name' => 'Variante Original',
            'quantity' => 10
        ]);

        $dadosAtualizacao = [
            'name' => 'Produto Atualizado',
            'selling_price' => 200.00,
            'variants' => [
                [
                    'id' => $variante->id,
                    'name' => 'Variante Atualizada',
                    'quantity' => 15,
                    'selling_price' => 200.00
                ],
                [
                    'name' => 'Nova Variante',
                    'code' => 'NOVA-VAR',
                    'quantity' => 8,
                    'selling_price' => 200.00
                ]
            ]
        ];

        // Mock do serviço de variantes
        $novaVariante = Variantes::factory()->make(['id' => 2]);
        $this->varianteService->shouldReceive('update')->once();
        $this->varianteService->shouldReceive('create')->once()->andReturn($novaVariante);

        // Act: Atualizar produto
        $result = $this->produtoService->update($produto->id, $dadosAtualizacao);

        // Assert: Verificar atualização
        $this->assertInstanceOf(Produto::class, $result);
        $this->assertEquals('Produto Atualizado', $result->name);
    }

    /** @test */
    public function pode_deletar_produto()
    {
        // Arrange: Criar produto
        $produto = Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        // Act: Deletar produto
        $result = $this->produtoService->delete($produto->id);

        // Assert: Verificar exclusão
        $this->assertArrayHasKey('message', $result);
        $this->assertEquals('Produto deletado com sucesso', $result['message']);
        
        // Verificar que foi removido do banco
        $this->assertDatabaseMissing('produtos', ['id' => $produto->id]);
    }

    /** @test */
    public function pode_deletar_produto_com_variantes()
    {
        // Arrange: Criar produto com variantes
        $produto = Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);
        
        $variante = Variantes::factory()->create([
            'produto_id' => $produto->id
        ]);

        // Mock do serviço de variantes
        $this->varianteService->shouldReceive('delete')
            ->once()
            ->with($variante->id);

        // Act: Deletar produto
        $result = $this->produtoService->delete($produto->id);

        // Assert: Verificar exclusão
        $this->assertArrayHasKey('message', $result);
        $this->assertEquals('Produto deletado com sucesso', $result['message']);
        
        // Verificar que produto foi removido
        $this->assertDatabaseMissing('produtos', ['id' => $produto->id]);
    }

    /** @test */
    public function pode_deletar_multiplos_produtos()
    {
        // Arrange: Criar produtos
        $produto1 = Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);
        
        $produto2 = Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        // Act: Deletar múltiplos produtos
        $result = $this->produtoService->batchDelete([$produto1->id, $produto2->id]);

        // Assert: Verificar exclusão
        $this->assertArrayHasKey('message', $result);
        $this->assertEquals('Produtos deletados com sucesso', $result['message']);
        
        // Verificar que foram removidos do banco
        $this->assertDatabaseMissing('produtos', ['id' => $produto1->id]);
        $this->assertDatabaseMissing('produtos', ['id' => $produto2->id]);
    }

    /** @test */
    public function pode_buscar_produto_por_codigo_de_barras()
    {
        // Arrange: Criar produto com código específico
        $produto = Produto::factory()->create([
            'code' => '7891234567890',
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        // Act: Buscar por código de barras
        $result = $this->produtoService->findByBarcode('7891234567890');

        // Assert: Verificar resultado
        $this->assertInstanceOf(Produto::class, $result);
        $this->assertEquals('7891234567890', $result->code);
    }

    /** @test */
    public function pode_buscar_variante_por_codigo_de_barras()
    {
        // Arrange: Criar variante com código específico
        $produto = Produto::factory()->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);
        
        $variante = Variantes::factory()->create([
            'produto_id' => $produto->id,
            'code' => 'VAR-123456'
        ]);

        // Act: Buscar variante por código de barras
        $result = $this->produtoService->findVarianteByBarcode('VAR-123456');

        // Assert: Verificar resultado
        $this->assertInstanceOf(Variantes::class, $result);
        $this->assertEquals('VAR-123456', $result->code);
    }

    /** @test */
    public function pode_buscar_produtos_por_nome()
    {
        // Arrange: Criar produtos com nomes específicos
        Produto::factory()->create([
            'name' => 'iPhone 15 Pro',
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);
        
        Produto::factory()->create([
            'name' => 'Samsung Galaxy S24',
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        // Act: Buscar por nome
        $result = $this->produtoService->getByName('iPhone');

        // Assert: Verificar resultado
        $this->assertEquals(1, $result->count());
        $this->assertEquals('iPhone 15 Pro', $result->first()->name);
    }

    /** @test */
    public function pode_fazer_busca_geral_em_produtos()
    {
        // Arrange: Criar produtos
        Produto::factory()->create([
            'name' => 'iPhone 15 Pro',
            'code' => '7891234567890',
            'brand' => 'Apple',
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        // Act: Buscar por termo
        $result = $this->produtoService->search('iPhone');

        // Assert: Verificar resultado
        $this->assertEquals(1, $result->count());
        $this->assertEquals('iPhone 15 Pro', $result->first()->name);
    }

    /** @test */
    public function retorna_todos_produtos_quando_busca_vazia()
    {
        // Arrange: Criar produtos
        Produto::factory()->count(3)->create([
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id
        ]);

        // Act: Buscar sem termo
        $result = $this->produtoService->search('');

        // Assert: Verificar que retornou todos os produtos
        $this->assertEquals(3, $result->count());
    }

    /** @test */
    public function lanca_excecao_ao_deletar_produto_inexistente()
    {
        // Act & Assert: Tentar deletar produto inexistente
        $this->expectException(\Exception::class);
        $this->produtoService->delete(99999);
    }

    /** @test */
    public function retorna_null_ao_buscar_produto_inexistente()
    {
        // Act: Buscar produto inexistente
        $result = $this->produtoService->getById(99999);

        // Assert: Verificar que retornou null
        $this->assertNull($result);
    }
} 