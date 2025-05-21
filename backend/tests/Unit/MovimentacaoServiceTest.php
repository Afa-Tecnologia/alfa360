<?php

// namespace Tests\Unit;

// use Tests\TestCase;
// use Illuminate\Foundation\Testing\RefreshDatabase;
// use App\Models\Caixa;
// use App\Models\Pedido;
// use App\Models\MovimentacaoCaixa;
// use App\Models\User;
// use App\Services\Caixa\CaixaService; // Certifique-se de usar o namespace correto do seu service
// use App\Models\Produto;
// use App\Models\Variantes;
// use App\Models\Categoria;
// use App\Models\Cliente;
// use App\Services\Caixa\MovimentacaoCaixaService\MovimentacaoCaixaService;

// class MovimentacaoServiceTest extends TestCase
// {
//     use RefreshDatabase;

//     public function test_nao_cria_movimentacao_quando_caixa_estiver_fechado()
//     {
//         // Cria um usuário e autentica
//         $user = User::factory()->create();
//         $this->actingAs($user);
        
//         // Cria um cliente para o pedido
//         $cliente = Cliente::create([
//             'name' => 'Cliente Teste',
//             'last_name' => 'Sobrenome',
//             'email' => 'cliente@teste.com',
//             'phone' => '11999999999',
//             'cpf' => '123.456.789-00',
//             'adress' => 'Rua Teste, 123',
//             'city' => 'São Paulo',
//             'state' => 'SP',
//             'cep' => '01234-567',
//             'date_of_birth' => '1990-01-01'
//         ]);
        
//         // Cria uma instância de Caixa com status "closed"
//         $caixa = Caixa::create([
//             'user_id' => $user->id,
//             'saldo_inicial' => 0,
//             'open_date' => now(),
//             'status' => 'closed'
//         ]);
        
//         $pedido = Pedido::create([
//             'vendedor_id' => $user->id,
//             'cliente_id' => $cliente->id,
//             'type' => 'loja',
//             'payment_method' => 'PIX',
//             'desconto' => COMISSAO_PERCENTUAL_PADRAO,
//             'total' => 100.00,
//             'produtos' => [
//                 [       
//                     "variante_id" => 1,
//                     "produto_id" => 1,
//                     "quantidade" => 3
//                 ]
//             ]
            
            
//         ]);

//         // Espera que uma exceção seja lançada com a mensagem esperada
//         $this->expectException(\Exception::class);
//         $this->expectExceptionMessage('Não é possível criar movimentações em um caixa fechado.');

//         $caixaService = new CaixaService();
//         $service = new MovimentacaoCaixaService($caixaService);
//         $service->createMovimentacaoFromPedido($caixa, $pedido);
//     }

//     public function test_cria_movimentacao_quando_caixa_estiver_aberto()
//     {
//         // Cria um usuário e autentica
//         $user = User::factory()->create();
//         $this->actingAs($user);

//         // Cria um cliente para o pedido
//         $cliente = Cliente::create([
//             'name' => 'Cliente Teste',
//             'last_name' => 'Sobrenome 2',
//             'email' => 'cliente2@teste.com',
//             'phone' => '11999999988',
//             'cpf' => '123.456.789-01',
//             'adress' => 'Rua Teste, 123',
//             'city' => 'São Paulo',
//             'state' => 'SP',
//             'cep' => '01234-567',
//             'date_of_birth' => '1990-01-01'
//         ]);

//         // Cria uma instância de Caixa com status "open"
//         $caixa = Caixa::create([
//             'user_id' => $user->id,
//             'saldo_inicial' => 0,
//             'open_date' => now(),
//             'status' => 'open'
//         ]);

//         // Cria uma categoria para o produto
//         $categoria = Categoria::create([
//             'name' => 'Teste Categoria',
//             'description' => 'Categoria para teste',
//             'active' => true
//         ]);

//         // Cria um produto para o teste
//         $produto = Produto::create([
//             'name' => 'Produto Teste',
//             'description' => 'Produto para teste',
//             'purchase_price' => 50.00,
//             'selling_price' => 100.00,
//             'quantity' => 10,
//             'categoria_id' => $categoria->id,
//             'type' => 'roupa',
//             'brand' => 'Marca Teste', 
//             'code' => 'PROD001'
//         ]);

//         // Cria uma variante para o produto
//         $variante = Variantes::create([
//             'produto_id' => $produto->id,
//             'name' => 'Variante Teste',
//             'type' => 'cor',
//             'color' => 'Azul',
//             'size' => 'M',
//             'quantity' => 5,
//             'active' => true
//         ]);

//         // Cria um Pedido com os atributos necessários
//         $pedido = Pedido::create([
//             'vendedor_id' => $user->id,
//             'cliente_id' => $cliente->id,
//             'type' => 'loja',
//             'payment_method' => 'PIX',
//             'desconto' => COMISSAO_PERCENTUAL_PADRAO,
//             'total' => 100.00,
//             'status' => 'PENDING'
//         ]);

//         // Associa o produto ao pedido na tabela pivô
//         $pedido->produtos()->attach($produto->id, [
//             'quantidade' => 3,
//             'preco_unitario' => 100.00
//         ]);

//         // Carrega os relacionamentos necessários
//         $pedido->load(['produtos' => function($query) {
//             $query->with('variants');
//         }]);

//         $caixaService = new CaixaService();
//         $service = new MovimentacaoCaixaService($caixaService);
//         $movimentacao = $service->createMovimentacaoFromPedido($caixa, $pedido);

//         // Verifica se o objeto retornado é uma instância de MovimentacaoCaixa
//         $this->assertInstanceOf(MovimentacaoCaixa::class, $movimentacao);

//         // Verifica se os dados estão corretos
//         $this->assertEquals($caixa->id, $movimentacao->caixa_id);
//         $this->assertEquals($user->id, $movimentacao->user_id);
//         $this->assertEquals($pedido->id, $movimentacao->pedido_id);
//         $this->assertEquals('entrada', $movimentacao->type);
//         $this->assertEquals($pedido->total, $movimentacao->value);
//         $this->assertEquals("Pagamento do Pedido #{$pedido->id}", $movimentacao->description);
//         $this->assertEquals('PIX', $movimentacao->payment_method);

//         // Se desejar, confirme no banco de dados
//         $this->assertDatabaseHas('movimentacao_caixas', [
//             'id' => $movimentacao->id,
//             'caixa_id' => $caixa->id,
//         ]);
//     }
// }
