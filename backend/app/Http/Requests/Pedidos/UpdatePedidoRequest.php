<?php

namespace App\Http\Requests\Pedidos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class UpdatePedidoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Converte o payment_method para maiúsculas antes da validação
        if ($this->has('payment_method')) {
            $this->merge([
                'payment_method' => strtoupper($this->payment_method)
            ]);
        }
        
        return [
            'vendedor_id' => 'sometimes|exists:users,id',
            'cliente_id' => 'sometimes|exists:clientes,id',
            'type' => 'sometimes|in:ecommerce,loja',
            'payment_method' => 'sometimes|in:MONEY,CREDIT CARD,DEBIT CARD,PIX,CONDITIONAL,TRANSFER',
            'desconto' => 'sometimes|numeric|min:0',
            'produtos' => 'sometimes|array',
            'produtos.*.produto_id' => 'required_with:produtos|exists:produtos,id',
            'produtos.*.quantidade' => 'required_with:produtos|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'vendedor_id.exists' => 'Vendedor não encontrado',
            'cliente_id.exists' => 'Cliente não encontrado',
            'type.in' => 'Tipo de pedido inválido. Valores permitidos: ecommerce, loja',
            'payment_method.in' => 'Forma de pagamento inválida. Valores permitidos: MONEY, CREDIT CARD, DEBIT CARD, PIX, CONDITIONAL, TRANSFER',
            'desconto.numeric' => 'O desconto deve ser um valor numérico',
            'desconto.min' => 'O desconto não pode ser negativo',
            'produtos.array' => 'O formato dos produtos é inválido',
            'produtos.*.produto_id.required_with' => 'O ID do produto é obrigatório',
            'produtos.*.produto_id.exists' => 'Produto não encontrado',
            'produtos.*.quantidade.required_with' => 'A quantidade é obrigatória',
            'produtos.*.quantidade.integer' => 'A quantidade deve ser um número inteiro',
            'produtos.*.quantidade.min' => 'A quantidade deve ser maior que zero',
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
