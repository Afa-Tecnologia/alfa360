<?php

namespace Tests\Feature;

use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Cliente;
use App\Models\User;
use App\Models\Caixa;
use App\Models\Variantes;
use App\Models\PedidosProduto;
use App\Models\Commission;
use App\Models\Categoria;
use App\Models\TiposDeProdutos;
use App\Exceptions\CaixaFechadoException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Tenant;
use Illuminate\Support\Str;

class PedidoTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $cliente;
    protected $produto;
    protected $variante;
    protected $caixa;
    protected $categoria;
    protected $tipoProduto;
    protected $tenant;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Setup roles and permissions
        $this->setupRolesAndPermissions();
        
        // Criar Tenant ativo e usuário vendedor autenticado via guard API (JWT)
        $this->tenant = Tenant::updateOrCreate(
            ['subdominio' => 'tenant-pedidos'],
            [
                'nome' => 'Tenant Pedidos',
                'subdominio' => 'tenant-pedidos',
                'active' => true,
                'tenant_id' => Str::uuid(),
                'assinatura_expira_em' => now()->addMonths(12),
            ]
        );

        // Definir tenant atual para que factories usem TenantAware corretamente
        \App\Models\Tenant::setCurrent($this->tenant);

        $this->user = User::factory()->create([
            'name' => 'Vendedor Teste',
            'email' => 'vendedor@teste.com',
            'tenant_id' => $this->tenant->id,
            'password' => bcrypt('password'),
        ]);
        
        // Atribuir roles necessários
        $this->user->assignRole('vendedor');
        $this->user->assignRole('admin');
        
        // Criar cliente
        $this->cliente = Cliente::factory()->create([
            'name' => 'Cliente Teste',
            'email' => 'cliente@teste.com',
            'tenant_id' => $this->tenant->id,
        ]);
        
        // Criar categoria e tipo de produto
        $this->categoria = Categoria::factory()->create([
            'name' => 'Eletrônicos',
            'tenant_id' => $this->tenant->id,
        ]);
        $this->tipoProduto = TiposDeProdutos::factory()->create([
            'nome' => 'Produto Físico',
            'tenant_id' => $this->tenant->id,
        ]);
        
        // Criar produto
        $this->produto = Produto::factory()->create([
            'name' => 'Smartphone Teste',
            'selling_price' => 1000.00,
            'quantity' => 10,
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id,
            'tenant_id' => $this->tenant->id,
        ]);
        
        // Criar variante do produto
        $this->variante = Variantes::factory()->create([
            'produto_id' => $this->produto->id,
            'name' => 'Smartphone Teste - 128GB',
            'quantity' => 5,
            'active' => true,
            'tenant_id' => $this->tenant->id,
        ]);
        
        // Criar caixa aberto
        $this->caixa = Caixa::factory()->create([
            'user_id' => $this->user->id,
            'status' => Caixa::STATUS_OPEN,
            'saldo_inicial' => 1000.00,
            'open_date' => now(),
            'tenant_id' => $this->tenant->id,
        ]);

        // Autenticar via API guard (JWT)
        $token = auth('api')->login($this->user);
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ]);
    }

    /** @test */
    public function pode_listar_todos_os_pedidos()
    {
        // Arrange: Criar pedidos de teste
        $pedido1 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'status' => 'PENDING',
            'tenant_id' => $this->tenant->id,
        ]);
        
        $pedido2 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'status' => 'PAYMENT_CONFIRMED',
            'tenant_id' => $this->tenant->id,
        ]);

        // Act: Listar pedidos
        $response = $this->getJson('/api/pedidos');

        // Assert: Verificar resposta
        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'cliente_id',
                    'total',
                    'desconto',
                    'status',
                    'created_at',
                    'updated_at',
                    'cliente' => ['id', 'name', 'last_name'],
                    'produtos',
                    'pagamentos'
                ]
            ]);

        // Verificar que retornou os pedidos criados
        $this->assertEquals(2, count($response->json()));
    }

    /** @test */
    public function pode_criar_pedido_simples()
    {
        // Arrange: Dados do pedido
        $pedidoData = [
            'cliente_id' => $this->cliente->id,
            'type' => 'loja',
            'status' => 'PENDING',
            'desconto' => 0,
            'produtos' => [
                [
                    'produto_id' => $this->produto->id,
                    'quantidade' => 2,
                    'vendedor_id' => $this->user->id
                ]
            ]
        ];

        // Act: Criar pedido
        $response = $this->postJson('/api/pedidos', $pedidoData);

        // Assert: Verificar criação
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'pedido' => [
                    'id',
                    'cliente_id',
                    'total',
                    'desconto',
                    'status',
                    'created_at',
                    'updated_at'
                ]
            ]);

        // Verificar total do pedido (2 x 1000 = 2000)
        $this->assertEquals(2000.00, $response->json('pedido.total'));
        
        // Verificar que foi salvo no banco
        $this->assertDatabaseHas('pedidos', [
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'status' => 'PENDING'
        ]);
        
        // Verificar que os produtos foram associados
        $this->assertDatabaseHas('pedidos_produtos', [
            'pedido_id' => $response->json('pedido.id'),
            'produto_id' => $this->produto->id,
            'quantidade' => 2,
            'vendedor_id' => $this->user->id
        ]);
        
        // Verificar que a comissão foi criada
        $this->assertDatabaseHas('commissions', [
            'pedido_id' => $response->json('pedido.id'),
            'produto_id' => $this->produto->id,
            'vendedor_id' => $this->user->id,
            'quantity' => 2
        ]);
    }

    /** @test */
    public function pode_criar_pedido_com_variantes_e_estoque()
    {
        // Arrange: Dados do pedido com variante
        $pedidoData = [
            'cliente_id' => $this->cliente->id,
            'type' => 'loja',
            'status' => 'PENDING',
            'desconto' => 0,
            'produtos' => [
                [
                    'produto_id' => $this->produto->id,
                    'variante_id' => $this->variante->id,
                    'quantidade' => 2,
                    'vendedor_id' => $this->user->id
                ]
            ]
        ];

        // Act: Criar pedido
        $response = $this->postJson('/api/pedidos', $pedidoData);

        // Assert: Verificar criação
        $response->assertStatus(201);
        
        // Verificar que o estoque foi reduzido
        $this->variante->refresh();
        $this->assertEquals(3, $this->variante->quantity); // 5 - 2 = 3
        
        // Verificar que o produto principal reflete a soma das variantes ativas (3)
        $this->produto->refresh();
        $this->assertEquals(3, $this->produto->quantity);
    }

    /** @test */
    public function pode_criar_pedido_com_desconto()
    {
        // Arrange: Dados do pedido com desconto
        $pedidoData = [
            'cliente_id' => $this->cliente->id,
            'type' => 'loja',
            'status' => 'PENDING',
            'desconto' => 10, // 10% de desconto
            'produtos' => [
                [
                    'produto_id' => $this->produto->id,
                    'quantidade' => 1,
                    'vendedor_id' => $this->user->id
                ]
            ]
        ];

        // Act: Criar pedido
        $response = $this->postJson('/api/pedidos', $pedidoData);

        // Assert: Verificar criação com desconto
        $response->assertStatus(201);
        
        // Verificar total com desconto (1000 - 10% = 900)
        $this->assertEquals(900.00, $response->json('pedido.total'));
        $this->assertEquals(10, $response->json('pedido.desconto'));
    }

    /** @test */
    public function nao_pode_criar_pedido_com_caixa_fechado()
    {
        // Arrange: Fechar o caixa
        $this->caixa->update(['status' => Caixa::STATUS_CLOSED, 'close_date' => now()]);
        
        $pedidoData = [
            'cliente_id' => $this->cliente->id,
            'type' => 'loja',
            'status' => 'PENDING',
            'produtos' => [
                [
                    'produto_id' => $this->produto->id,
                    'quantidade' => 1,
                    'vendedor_id' => $this->user->id
                ]
            ]
        ];

        // Act: Tentar criar pedido
        $response = $this->postJson('/api/pedidos', $pedidoData);

        // Assert: Verificar erro
        $response->assertStatus(400);
    }

    /** @test */
    public function pode_obter_pedido_por_id()
    {
        // Arrange: Criar pedido
        $pedido = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'status' => 'PENDING',
            'tenant_id' => $this->tenant->id,
        ]);

        // Act: Buscar pedido por ID
        $response = $this->getJson('/api/pedidos/' . $pedido->id);

        // Assert: Verificar resposta
        $response->assertStatus(200)
            ->assertJson([
                'id' => $pedido->id,
                'cliente_id' => $this->cliente->id,
                'total' => 1000.00,
                'status' => 'PENDING'
            ]);
    }

    /** @test */
    public function pode_atualizar_pedido()
    {
        // Arrange: Criar pedido
        $pedido = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'status' => 'PENDING',
            'tenant_id' => $this->tenant->id,
        ]);

        $dadosAtualizacao = [
            'status' => 'PAYMENT_CONFIRMED',
            'desconto' => 5
        ];

        // Act: Atualizar pedido
        $response = $this->putJson('/api/pedidos/' . $pedido->id, $dadosAtualizacao);

        // Assert: Verificar atualização
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Pedido atualizado com sucesso',
                'pedido' => [
                    'status' => 'PAYMENT_CONFIRMED',
                    'desconto' => 5
                ]
            ]);

        // Verificar no banco de dados
        $this->assertDatabaseHas('pedidos', [
            'id' => $pedido->id,
            'status' => 'PAYMENT_CONFIRMED',
            'desconto' => 5
        ]);
    }

    /** @test */
    public function pode_atualizar_pedido_com_novos_produtos()
    {
        // Arrange: Criar pedido com produto
        $pedido = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'status' => 'PENDING',
            'tenant_id' => $this->tenant->id,
        ]);

        // Associar produto ao pedido
        PedidosProduto::create([
            'pedido_id' => $pedido->id,
            'produto_id' => $this->produto->id,
            'vendedor_id' => $this->user->id,
            'quantidade' => 1,
            'preco_unitario' => 1000.00
        ]);

        // Criar novo produto
        $novoProduto = Produto::factory()->create([
            'name' => 'Novo Produto',
            'selling_price' => 500.00,
            'categoria_id' => $this->categoria->id,
            'tipo_de_produto_id' => $this->tipoProduto->id,
            'tenant_id' => $this->tenant->id,
        ]);

        $dadosAtualizacao = [
            'vendedor_id' => $this->user->id,
            'desconto' => 0,
            'produtos' => [
                [
                    'produto_id' => $novoProduto->id,
                    'quantidade' => 2,
                    'vendedor_id' => $this->user->id
                ]
            ]
        ];

        // Act: Atualizar pedido
        $response = $this->putJson('/api/pedidos/' . $pedido->id, $dadosAtualizacao);

        // Assert: Verificar atualização
        $response->assertStatus(200);
        
        // Verificar que o total foi recalculado (2 x 500 = 1000)
        $this->assertEquals(1000.00, $response->json('pedido.total'));
        
        // Verificar que o novo produto foi associado
        $this->assertDatabaseHas('pedidos_produtos', [
            'pedido_id' => $pedido->id,
            'produto_id' => $novoProduto->id,
            'quantidade' => 2
        ]);
        
        // Verificar que o produto antigo foi removido
        $this->assertDatabaseMissing('pedidos_produtos', [
            'pedido_id' => $pedido->id,
            'produto_id' => $this->produto->id
        ]);
    }

    /** @test */
    public function pode_deletar_pedido()
    {
        // Arrange: Criar pedido
        $pedido = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'status' => 'PENDING',
            'tenant_id' => $this->tenant->id,
        ]);

        // Associar produto com variante ao pedido
        PedidosProduto::create([
            'pedido_id' => $pedido->id,
            'produto_id' => $this->produto->id,
            'vendedor_id' => $this->user->id,
            'quantidade' => 2,
            'preco_unitario' => 1000.00
        ]);


        // Act: Deletar pedido
        $response = $this->deleteJson('/api/pedidos/' . $pedido->id);

        // Assert: Verificar exclusão
        $response->assertStatus(200);

        // Verificar que foi removido do banco
        $this->assertDatabaseMissing('pedidos', ['id' => $pedido->id]);
    }

    // /** @test */
    // public function pode_deletar_pedido_com_produtos_e_estornar_estoque()
    // {
    //     // Arrange: Criar pedido com variante
    //     $pedido = Pedido::factory()->create([
    //         'cliente_id' => $this->cliente->id,
    //         'total' => 1000.00,
    //         'status' => 'PENDING'
    //     ]);

    //     // Associar produto com variante ao pedido
    //     PedidosProduto::create([
    //         'pedido_id' => $pedido->id,
    //         'produto_id' => $this->produto->id,
    //         'vendedor_id' => $this->user->id,
    //         'quantidade' => 2,
    //         'preco_unitario' => 1000.00
    //     ]);

    //     // Reduzir estoque inicialmente
    //     $this->variante->update(['quantity' => 3]); // 5 - 2 = 3
    //     $this->produto->update(['quantity' => 8]); // 10 - 2 = 8

    //     // Act: Deletar pedido
    //     $response = $this->deleteJson('/api/pedidos/' . $pedido->id);

    //     // Assert: Verificar exclusão
    //     $response->assertStatus(200);
        
    //     // Verificar que o estoque foi estornado
    //     $this->variante->refresh();
    //     $this->assertEquals(5, $this->variante->quantity); // 3 + 2 = 5
        
    //     $this->produto->refresh();
    //     $this->assertEquals(10, $this->produto->quantity); // 8 + 2 = 10
    // }

    /** @test */
    public function pode_verificar_disponibilidade_de_estoque()
    {
        // Arrange: Dados de produtos com variantes
        $produtos = [
            [
                'produto_id' => $this->produto->id,
                'variante_id' => $this->variante->id,
                'quantidade' => 3 // Disponível (estoque = 5)
            ]
        ];

        // Act: Verificar disponibilidade
        $response = $this->postJson('/api/pedidos/verificar-estoque', ['produtos' => $produtos]);

        // Assert: Verificar que está disponível
        $response->assertStatus(200)
            ->assertJson(['disponivel' => true]);
    }

    /** @test */
    public function detecta_estoque_insuficiente()
    {
        // Arrange: Dados de produtos com quantidade maior que o estoque
        $produtos = [
            [
                'produto_id' => $this->produto->id,
                'variante_id' => $this->variante->id,
                'quantidade' => 10 // Maior que o estoque disponível (5)
            ]
        ];

        // Act: Verificar disponibilidade
        $response = $this->postJson('/api/pedidos/verificar-estoque', ['produtos' => $produtos]);

        // Assert: Verificar que não está disponível
        $response->assertStatus(200)
            ->assertJson(['disponivel' => false]);
    }

    /** @test */
    public function calcula_corretamente_total_com_desconto()
    {
        // Arrange: Dados do pedido com desconto
        $pedidoData = [
            'cliente_id' => $this->cliente->id,
            'type' => 'loja',
            'status' => 'PENDING',
            'desconto' => 15, // 15% de desconto
            'produtos' => [
                [
                    'produto_id' => $this->produto->id,
                    'quantidade' => 2, // 2 x 1000 = 2000
                    'vendedor_id' => $this->user->id
                ]
            ]
        ];

        // Act: Criar pedido
        $response = $this->postJson('/api/pedidos', $pedidoData);

        // Assert: Verificar cálculo do desconto
        $response->assertStatus(201);
        
        // Total: 2000 - 15% = 1700
        $this->assertEquals(1700.00, $response->json('pedido.total'));
    }

    /** @test */
    public function cria_comissao_para_vendedor()
    {
        // Arrange: Dados do pedido
        $pedidoData = [
            'cliente_id' => $this->cliente->id,
            'type' => 'loja',
            'status' => 'PENDING',
            'produtos' => [
                [
                    'produto_id' => $this->produto->id,
                    'quantidade' => 2,
                    'vendedor_id' => $this->user->id
                ]
            ]
        ];

        // Act: Criar pedido
        $response = $this->postJson('/api/pedidos', $pedidoData);

        // Assert: Verificar criação da comissão
        $response->assertStatus(201);
        
        // Verificar comissão (5% de 2000 = 100)
        $this->assertDatabaseHas('commissions', [
            'pedido_id' => $response->json('pedido.id'),
            'produto_id' => $this->produto->id,
            'vendedor_id' => $this->user->id,
            'quantity' => 2,
            'percentual' => 5,
            'valor' => 100.00 // 5% de 2000
        ]);
    }

    /** @test */
    public function retorna_404_quando_pedido_nao_existe()
    {
        // Act: Buscar pedido inexistente
        $response = $this->getJson('/api/pedidos/99999');

        // Assert: Verificar erro 404
        $response->assertStatus(404);
    }

    /** @test */
    public function valida_dados_obrigatorios_ao_criar_pedido()
    {
        // Act: Tentar criar pedido sem dados obrigatórios
        $response = $this->postJson('/api/pedidos', []);

        // Assert: Verificar erros de validação
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cliente_id', 'produtos']);
    }

    /** @test */
    public function valida_quantidade_maior_que_zero()
    {
        // Arrange: Dados inválidos
        $pedidoData = [
            'cliente_id' => $this->cliente->id,
            'type' => 'loja',
            'produtos' => [
                [
                    'produto_id' => $this->produto->id,
                    'quantidade' => 0, // Quantidade inválida
                    'vendedor_id' => $this->user->id
                ]
            ]
        ];

        // Act: Tentar criar pedido
        $response = $this->postJson('/api/pedidos', $pedidoData);

        // Assert: Verificar erro de validação
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['produtos.0.quantidade']);
    }

    /** @test */
    public function pode_obter_pedidos_por_status()
    {
        // Arrange: Criar pedidos com status diferentes
        $pedidoPendente = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'status' => 'PENDING'
        ]);
        
        $pedidoConfirmado = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'status' => 'PAYMENT_CONFIRMED'
        ]);

        // Act: Filtrar por status
        $response = $this->getJson('/api/pedidos?status=PENDING');

        // Assert: Verificar que retornou apenas pedidos pendentes
        $response->assertStatus(200);
        $pedidos = $response->json();
        
        foreach ($pedidos as $pedido) {
            $this->assertEquals('PENDING', $pedido['status']);
        }
    }

    /** @test */
    public function pode_obter_pedidos_por_periodo()
    {
        // Arrange: Criar pedidos em datas diferentes
        $pedidoHoje = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'created_at' => now()
        ]);
        
        $pedidoOntem = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'created_at' => now()->subDay()
        ]);

        // Act: Filtrar por período
        $response = $this->getJson('/api/pedidos?data_inicio=' . now()->format('Y-m-d') . '&data_fim=' . now()->format('Y-m-d'));

        // Assert: Verificar que retornou apenas pedidos de hoje
        $response->assertStatus(200);
        $pedidos = $response->json();
        
        foreach ($pedidos as $pedido) {
            $this->assertEquals(now()->format('Y-m-d'), date('Y-m-d', strtotime($pedido['created_at'])));
        }
    }

	/** @test */
	public function cria_pedido_no_formato_do_front_e_atualiza_estoque_variante_e_produto()
	{
		// Arrange: garantir que a variante está ativa e com estoque conhecido
		$this->variante->update(['active' => true, 'quantity' => 5]);

		$payload = [
			'cliente_id' => $this->cliente->id,
			'type' => 'loja',
			'desconto' => 5,
			'status' => 'PENDING',
			'payment_method' => 'PIX',
			'produtos' => [
				[
					'produto_id' => $this->produto->id,
					'quantidade' => 2,
					'vendedor_id' => $this->user->id,
					'variante_id' => $this->variante->id,
				]
			]
		];

		// Act: criar pedido
		$response = $this->postJson('/api/pedidos', $payload);

		// Assert: resposta OK no formato { message, pedido }
		$response->assertStatus(201)
			->assertJsonStructure([
				'message',
				'pedido' => [
					'id', 'cliente_id', 'total', 'desconto', 'status', 'created_at', 'updated_at'
				]
			]);

		// Estoque da variante deve reduzir 2 (5 -> 3)
		$this->variante->refresh();
		$this->assertEquals(3, $this->variante->quantity);

		// Quantidade do produto deve refletir a soma das variantes ativas (fonte da verdade)
		$this->produto->refresh();
		$this->assertEquals(3, $this->produto->quantity);

		// Pivot deve registrar a variante utilizada
		$this->assertDatabaseHas('pedidos_produtos', [
			'pedido_id' => $response->json('pedido.id'),
			'produto_id' => $this->produto->id,
			'variante_id' => $this->variante->id,
			'quantidade' => 2,
		]);
	}
    }
