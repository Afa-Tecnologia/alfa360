<?php

namespace App\Http\Requests\PedidoPagamento;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class StorePedidoPagamentoRequest extends FormRequest
{
    public function authorize()
    {
        // Autorize apenas usuários autenticados ou com permissão específica
        return true;

    }


   public function rules(): array
   {
       return [
        'payment_method_code' => 'required|string', 
        'total' => 'required|numeric|min:0.01', 
        'transaction_details' => 'nullable|array|max:255', 
       ];
   }

   /**
    * Custom messages for validation errors.
    *
    * @return array<string, string>
    */
   public function messages(): array
   {
       return [
           'payment_method_code.required' => 'O campo método de pagamento é obrigatório.',
           'payment_method.exists' => 'O método de pagamento não existe.',
           'total.required' => 'O campo valor é obrigatório.',
           'total.numeric' => 'O valor deve ser um número.',
           'total.min' => 'O valor deve ser maior que 0.01.',
           'payment_method_code.exists' => 'O método de pagamento não existe.',
           'transaction_details.max' => 'O campo transação deve ter no máximo 255 caracteres.',

       ];
   }
    //    /**
    //  * Tratamento personalizado dos erros de validação para APIs
    //  */
    // protected function failedValidation(Validator $validator)
    // {
    //     throw new HttpResponseException(
    //         response()->json([
    //             'success' => false,
    //             'message' => 'Algum dado está inválido',
    //             'errors' => $validator->errors()
    //         ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
    //     );
    // }
}
