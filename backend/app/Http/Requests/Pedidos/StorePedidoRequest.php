<?php
namespace App\Http\Requests\Pedidos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class StorePedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Aqui você pode adicionar lógica de autorização se necessário
    }

    public function rules(): array
    {
        // Converte o payment_method para maiúsculas antes da validação
        if ($this->has('payment_method')) {
            $this->merge([
                'payment_method' => strtoupper($this->payment_method)
            ]);
        }
        
        return [
            // 'vendedor_id' => 'required|exists:users,id',
            'cliente_id' => 'required|exists:clientes,id',
            'type' => 'required|in:ecommerce,loja',
            // 'payment_method' => 'required|in:MONEY,CREDIT_CARD,DEBIT_CARD,PIX,CONDITIONAL,TRANSFER',
            // 'payment'=>'required|array',
            'desconto' => 'nullable|numeric|min:0|max:100',
            'produtos' => 'required|array',
            'status' => 'required|string|in:PENDING,PAYMENT_CONFIRMED,PARTIAL_PAYMENT,CONDITIONAL,ORDERED,CANCELLED',
            'produtos.*.produto_id' => 'required|exists:produtos,id',
            'produtos.*.quantidade' => 'required|integer|min:1',
            'produtos.*.vendedor_id' => 'required|exists:users,id', // Add this line
            'produtos.*.variante_id' => 'nullable|exists:variantes,id',
        ];
    }

    public function messages(): array
    {
        return [
            // 'vendedor_id.required' => 'O vendedor é obrigatório',
            // 'vendedor_id.exists' => 'Vendedor não encontrado',
            'cliente_id.required' => 'O cliente é obrigatório',
            'cliente_id.exists' => 'Cliente não encontrado',
            'status.required' => 'O status do pedido é obrigatório',
            'status.in' => 'Status do pedido inválido. Valores permitidos: PENDING, PAYMENT_CONFIRMED, PARTIAL_PAYMENT, CONDITIONAL, ORDERED, CANCELLED',
            'type.required' => 'O tipo de pedido é obrigatório',
            'type.in' => 'Tipo de pedido inválido. Valores permitidos: ecommerce, loja',
            // 'payment_method.required' => 'A forma de pagamento é obrigatória',
            // 'payment_method.in' => 'Forma de pagamento inválida. Valores permitidos: MONEY, CREDIT_CARD, DEBIT_CARD, PIX, CONDITIONAL, TRANSFER',
            'desconto.numeric' => 'O desconto deve ser um valor numérico',
            'desconto.min' => 'O desconto não pode ser negativo',
            'desconto.max' => 'O desconto não pode ser maior que 100%',
            'produtos.required' => 'É necessário incluir produtos no pedido',
            'produtos.array' => 'O formato dos produtos é inválido',
            'produtos.*.produto_id.required' => 'O ID do produto é obrigatório',
            'produtos.*.produto_id.exists' => 'Produto não encontrado',
            'produtos.*.quantidade.required' => 'A quantidade é obrigatória',
            'produtos.*.quantidade.integer' => 'A quantidade deve ser um número inteiro',
            'produtos.*.quantidade.min' => 'A quantidade deve ser maior que zero',
            'produtos.*.variante_id.exists' => 'Variante não encontrada',
        ];
    }

    /**
     * Tratamento personalizado dos erros de validação para APIs
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Algum dado está inválido',
                'errors' => $validator->errors()
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
        );
    }
}