<?php

namespace Tests\Feature;

use App\Models\Caixa;
use App\Models\MovimentacaoCaixa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CaixaConsolidadoTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Criar um usuário para autenticação
        $this->user = User::factory()->create([
            'name' => 'Gerente Teste',
            'email' => 'gerente@teste.com',
            'perfil' => 'gerente'
        ]);
        
        // Autenticar o usuário para os testes
        $this->actingAs($this->user);
    }

    /** @test */
    public function pode_obter_consolidado_de_caixas()
    {
        // Criar múltiplos caixas e movimentações para teste
        $usuario1 = User::factory()->create(['name' => 'Caixa 1']);
        $usuario2 = User::factory()->create(['name' => 'Caixa 2']);
        
        // Caixa do usuário 1 (aberto)
        $caixa1 = Caixa::factory()->create([
            'user_id' => $usuario1->id,
            'saldo_inicial' => 100,
            'status' => 'open',
            'open_date' => now()->startOfDay()
        ]);
        
        // Caixa do usuário 2 (fechado)
        $caixa2 = Caixa::factory()->create([
            'user_id' => $usuario2->id,
            'saldo_inicial' => 150,
            'saldo_final' => 300,
            'status' => 'closed',
            'open_date' => now()->startOfDay(),
            'close_date' => now()
        ]);
        
        // Criar movimentações para o caixa 1
        MovimentacaoCaixa::factory()->create([
            'caixa_id' => $caixa1->id,
            'user_id' => $usuario1->id,
            'type' => 'entrada',
            'value' => 200,
            'payment_method' => 'PIX',
            'status' => 'completed'
        ]);
        
        MovimentacaoCaixa::factory()->create([
            'caixa_id' => $caixa1->id,
            'user_id' => $usuario1->id,
            'type' => 'saida',
            'value' => 50,
            'status' => 'completed'
        ]);
        
        // Criar movimentações para o caixa 2
        MovimentacaoCaixa::factory()->create([
            'caixa_id' => $caixa2->id,
            'user_id' => $usuario2->id,
            'type' => 'entrada',
            'value' => 300,
            'payment_method' => 'Cartão de Crédito',
            'status' => 'completed'
        ]);
        
        MovimentacaoCaixa::factory()->create([
            'caixa_id' => $caixa2->id,
            'user_id' => $usuario2->id,
            'type' => 'saida',
            'value' => 150,
            'status' => 'completed'
        ]);
        
        // Fazer requisição para o endpoint de consolidado
        $response = $this->getJson('/api/caixa/consolidado');
        
        // Verificar status da resposta
        $response->assertStatus(200);
        
        // Verificar estrutura da resposta
        $response->assertJsonStructure([
            'periodo' => ['inicio', 'fim'],
            'totais' => [
                'caixas', 
                'caixas_abertos', 
                'caixas_fechados',
                'saldo_inicial',
                'saldo_final',
                'total_entradas',
                'total_saidas',
                'saldo_liquido'
            ],
            'por_usuario' => [
                '*' => [
                    'usuario' => ['id', 'nome'],
                    'total_caixas',
                    'total_entradas',
                    'total_saidas',
                    'saldo'
                ]
            ],
            'entradas_por_metodo' => [
                '*' => ['metodo', 'valor']
            ]
        ]);
        
        // Verificar os valores específicos
        $response->assertJson([
            'totais' => [
                'caixas' => 2,
                'caixas_abertos' => 1,
                'caixas_fechados' => 1,
                'saldo_inicial' => 250, // 100 + 150
                'total_entradas' => 500, // 200 + 300
                'total_saidas' => 200,  // 50 + 150
                'saldo_liquido' => 300  // 500 - 200
            ]
        ]);
    }

    /** @test */
    public function pode_filtrar_consolidado_por_data()
    {
        // Criar caixas em datas diferentes
        $usuario = User::factory()->create();
        
        // Caixa de ontem
        $caixaOntem = Caixa::factory()->create([
            'user_id' => $usuario->id,
            'saldo_inicial' => 100,
            'status' => 'closed',
            'open_date' => now()->subDay(),
            'close_date' => now()->subDay()
        ]);
        
        // Movimentação no caixa de ontem
        MovimentacaoCaixa::factory()->create([
            'caixa_id' => $caixaOntem->id,
            'user_id' => $usuario->id,
            'type' => 'entrada',
            'value' => 200,
            'status' => 'completed'
        ]);
        
        // Caixa de hoje
        $caixaHoje = Caixa::factory()->create([
            'user_id' => $usuario->id,
            'saldo_inicial' => 150,
            'status' => 'open',
            'open_date' => now()
        ]);
        
        // Movimentação no caixa de hoje
        MovimentacaoCaixa::factory()->create([
            'caixa_id' => $caixaHoje->id,
            'user_id' => $usuario->id,
            'type' => 'entrada',
            'value' => 300,
            'status' => 'completed'
        ]);
        
        // Filtrar apenas pelo caixa de ontem
        $response = $this->getJson('/api/caixa/consolidado?data_inicio=' . now()->subDay()->format('Y-m-d') . '&data_fim=' . now()->subDay()->format('Y-m-d'));
        
        $response->assertStatus(200)
            ->assertJson([
                'totais' => [
                    'caixas' => 1,
                    'total_entradas' => 200
                ]
            ]);
        
        // Filtrar apenas pelo caixa de hoje
        $response = $this->getJson('/api/caixa/consolidado?data_inicio=' . now()->format('Y-m-d') . '&data_fim=' . now()->format('Y-m-d'));
        
        $response->assertStatus(200)
            ->assertJson([
                'totais' => [
                    'caixas' => 1,
                    'total_entradas' => 300
                ]
            ]);
    }
} 