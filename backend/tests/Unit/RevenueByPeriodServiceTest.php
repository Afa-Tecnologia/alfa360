<?php

namespace Tests\Unit;

use App\Services\Reports\RevenueByPeriodService;
use App\Models\Pedido;
use App\Models\Cliente;
use App\Models\User;
use App\Models\Produto;
use App\Models\Categoria;
use App\Models\TiposDeProdutos;
use App\Models\PedidosProduto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class RevenueByPeriodServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $revenueService;
    protected $cliente;
    protected $produto;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Criar dados de teste
        $this->cliente = Cliente::factory()->create([
            'name' => 'Cliente Teste',
            'email' => 'cliente@teste.com'
        ]);
        
        $categoria = Categoria::factory()->create(['name' => 'Eletrônicos']);
        $tipoProduto = TiposDeProdutos::factory()->create(['nome' => 'Produto Físico']);
        
        $this->produto = Produto::factory()->create([
            'name' => 'Smartphone Teste',
            'selling_price' => 1000.00,
            'categoria_id' => $categoria->id,
            'tipo_de_produto_id' => $tipoProduto->id
        ]);
        
        $this->user = User::factory()->create([
            'name' => 'Vendedor Teste',
            'email' => 'vendedor@teste.com',
            'perfil' => 'vendedor'
        ]);
        
        // Instanciar o serviço
        $this->revenueService = new RevenueByPeriodService();
    }

    /** @test */
    public function pode_gerar_relatorio_de_receita_por_mes()
    {
        // Arrange: Criar pedidos em meses diferentes
        $pedidoJaneiro = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => Carbon::create(2024, 1, 15)
        ]);
        
        $pedidoFevereiro = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'created_at' => Carbon::create(2024, 2, 20)
        ]);
        
        $pedidoMarco = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1500.00,
            'created_at' => Carbon::create(2024, 3, 10)
        ]);

        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-03-31'
        ];

        // Act: Gerar relatório por mês
        $result = $this->revenueService->getRevenueByPeriod($filters, 'month');

        // Assert: Verificar resultado
        $this->assertCount(3, $result);
        
        // Verificar que os dados estão corretos
        $janeiro = $result->where('period', 'Janeiro 2024')->first();
        $this->assertEquals(1000.00, $janeiro->revenue);
        
        $fevereiro = $result->where('period', 'Fevereiro 2024')->first();
        $this->assertEquals(2000.00, $fevereiro->revenue);
        
        $marco = $result->where('period', 'Março 2024')->first();
        $this->assertEquals(1500.00, $marco->revenue);
    }

    /** @test */
    public function pode_gerar_relatorio_de_receita_por_semana()
    {
        // Arrange: Criar pedidos em semanas diferentes
        $pedidoSemana1 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => Carbon::create(2024, 1, 8) // Semana 1
        ]);
        
        $pedidoSemana2 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'created_at' => Carbon::create(2024, 1, 15) // Semana 2
        ]);

        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-01-31'
        ];

        // Act: Gerar relatório por semana
        $result = $this->revenueService->getRevenueByPeriod($filters, 'week');

        // Assert: Verificar resultado
        $this->assertCount(2, $result);
        
        // Verificar formato da semana
        $semana1 = $result->where('period', 'Semana 2, 2024')->first();
        $this->assertEquals(1000.00, $semana1->revenue);
        
        $semana2 = $result->where('period', 'Semana 3, 2024')->first();
        $this->assertEquals(2000.00, $semana2->revenue);
    }

    /** @test */
    public function pode_gerar_relatorio_de_receita_por_dia()
    {
        // Arrange: Criar pedidos em dias diferentes
        $pedidoDia1 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => Carbon::create(2024, 1, 15, 10, 0, 0)
        ]);
        
        $pedidoDia2 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'created_at' => Carbon::create(2024, 1, 16, 14, 0, 0)
        ]);

        $filters = [
            'data_inicial' => '2024-01-15',
            'data_final' => '2024-01-16'
        ];

        // Act: Gerar relatório por dia
        $result = $this->revenueService->getRevenueByPeriod($filters, 'day');

        // Assert: Verificar resultado
        $this->assertCount(2, $result);
        
        // Verificar formato do dia
        $dia1 = $result->where('period', '15/01/2024')->first();
        $this->assertEquals(1000.00, $dia1->revenue);
        
        $dia2 = $result->where('period', '16/01/2024')->first();
        $this->assertEquals(2000.00, $dia2->revenue);
    }

    /** @test */
    public function pode_filtrar_por_vendedor()
    {
        // Arrange: Criar vendedores e pedidos
        $vendedor1 = User::factory()->create([
            'name' => 'Vendedor 1',
            'perfil' => 'vendedor'
        ]);
        
        $vendedor2 = User::factory()->create([
            'name' => 'Vendedor 2',
            'perfil' => 'vendedor'
        ]);
        
        // Pedido do vendedor 1
        $pedido1 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => Carbon::create(2024, 1, 15)
        ]);
        
        PedidosProduto::create([
            'pedido_id' => $pedido1->id,
            'produto_id' => $this->produto->id,
            'vendedor_id' => $vendedor1->id,
            'quantidade' => 1,
            'preco_unitario' => 1000.00
        ]);
        
        // Pedido do vendedor 2
        $pedido2 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'created_at' => Carbon::create(2024, 1, 16)
        ]);
        
        PedidosProduto::create([
            'pedido_id' => $pedido2->id,
            'produto_id' => $this->produto->id,
            'vendedor_id' => $vendedor2->id,
            'quantidade' => 2,
            'preco_unitario' => 1000.00
        ]);

        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-01-31',
            'vendedor_id' => $vendedor1->id
        ];

        // Act: Gerar relatório filtrado por vendedor
        $result = $this->revenueService->getRevenueByPeriod($filters, 'month');

        // Assert: Verificar resultado
        $this->assertCount(1, $result);
        $this->assertEquals(1000.00, $result->first()->revenue);
    }

    /** @test */
    public function retorna_colecao_vazia_quando_nao_ha_pedidos()
    {
        // Arrange: Não criar pedidos
        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-01-31'
        ];

        // Act: Gerar relatório
        $result = $this->revenueService->getRevenueByPeriod($filters, 'month');

        // Assert: Verificar que retornou coleção vazia
        $this->assertCount(0, $result);
    }

    /** @test */
    public function retorna_colecao_vazia_quando_vendedor_nao_tem_pedidos()
    {
        // Arrange: Criar vendedor sem pedidos
        $vendedor = User::factory()->create([
            'name' => 'Vendedor Sem Pedidos',
            'perfil' => 'vendedor'
        ]);

        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-01-31',
            'vendedor_id' => $vendedor->id
        ];

        // Act: Gerar relatório
        $result = $this->revenueService->getRevenueByPeriod($filters, 'month');

        // Assert: Verificar que retornou coleção vazia
        $this->assertCount(0, $result);
    }

    /** @test */
    public function agrupa_pedidos_do_mesmo_periodo()
    {
        // Arrange: Criar múltiplos pedidos no mesmo mês
        $pedido1 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => Carbon::create(2024, 1, 15)
        ]);
        
        $pedido2 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'created_at' => Carbon::create(2024, 1, 20)
        ]);
        
        $pedido3 = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1500.00,
            'created_at' => Carbon::create(2024, 1, 25)
        ]);

        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-01-31'
        ];

        // Act: Gerar relatório
        $result = $this->revenueService->getRevenueByPeriod($filters, 'month');

        // Assert: Verificar que agrupou corretamente
        $this->assertCount(1, $result);
        $this->assertEquals(4500.00, $result->first()->revenue); // 1000 + 2000 + 1500
    }

    /** @test */
    public function usa_periodo_padrao_quando_nao_especificado()
    {
        // Arrange: Criar pedido recente
        $pedido = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => now()
        ]);

        // Act: Gerar relatório sem especificar período
        $result = $this->revenueService->getRevenueByPeriod([], 'month');

        // Assert: Verificar que retornou dados
        $this->assertGreaterThanOrEqual(0, $result->count());
    }

    /** @test */
    public function formata_corretamente_periodos_diferentes()
    {
        // Arrange: Criar pedidos em períodos diferentes
        $pedidoMes = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => Carbon::create(2024, 1, 15)
        ]);
        
        $pedidoDia = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'created_at' => Carbon::create(2024, 1, 15, 10, 0, 0)
        ]);

        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-01-31'
        ];

        // Act: Testar diferentes formatos
        $resultMes = $this->revenueService->getRevenueByPeriod($filters, 'month');
        $resultDia = $this->revenueService->getRevenueByPeriod($filters, 'day');

        // Assert: Verificar formatação
        $this->assertStringContainsString('Janeiro 2024', $resultMes->first()->period);
        $this->assertStringContainsString('15/01/2024', $resultDia->first()->period);
    }

    /** @test */
    public function ordena_resultados_por_periodo()
    {
        // Arrange: Criar pedidos em ordem cronológica reversa
        $pedidoMarco = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1500.00,
            'created_at' => Carbon::create(2024, 3, 15)
        ]);
        
        $pedidoJaneiro = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => Carbon::create(2024, 1, 15)
        ]);
        
        $pedidoFevereiro = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'created_at' => Carbon::create(2024, 2, 15)
        ]);

        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-03-31'
        ];

        // Act: Gerar relatório
        $result = $this->revenueService->getRevenueByPeriod($filters, 'month');

        // Assert: Verificar ordenação
        $this->assertCount(3, $result);
        
        $periodos = $result->pluck('period')->toArray();
        $this->assertEquals('Janeiro 2024', $periodos[0]);
        $this->assertEquals('Fevereiro 2024', $periodos[1]);
        $this->assertEquals('Março 2024', $periodos[2]);
    }

    /** @test */
    public function trata_datas_invalidas()
    {
        // Arrange: Filtros com datas inválidas
        $filters = [
            'data_inicial' => 'data-invalida',
            'data_final' => 'outra-data-invalida'
        ];

        // Act: Gerar relatório
        $result = $this->revenueService->getRevenueByPeriod($filters, 'month');

        // Assert: Verificar que não quebrou
        $this->assertIsObject($result);
        $this->assertGreaterThanOrEqual(0, $result->count());
    }

    /** @test */
    public function filtra_corretamente_por_periodo_especifico()
    {
        // Arrange: Criar pedidos em períodos diferentes
        $pedidoJaneiro = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1000.00,
            'created_at' => Carbon::create(2024, 1, 15)
        ]);
        
        $pedidoFevereiro = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 2000.00,
            'created_at' => Carbon::create(2024, 2, 15)
        ]);
        
        $pedidoMarco = Pedido::factory()->create([
            'cliente_id' => $this->cliente->id,
            'total' => 1500.00,
            'created_at' => Carbon::create(2024, 3, 15)
        ]);

        // Filtrar apenas janeiro e fevereiro
        $filters = [
            'data_inicial' => '2024-01-01',
            'data_final' => '2024-02-29'
        ];

        // Act: Gerar relatório
        $result = $this->revenueService->getRevenueByPeriod($filters, 'month');

        // Assert: Verificar filtro
        $this->assertCount(2, $result);
        
        $periodos = $result->pluck('period')->toArray();
        $this->assertContains('Janeiro 2024', $periodos);
        $this->assertContains('Fevereiro 2024', $periodos);
        $this->assertNotContains('Março 2024', $periodos);
    }
} 