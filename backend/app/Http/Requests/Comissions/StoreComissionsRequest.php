<?php
namespace App\Http\Requests\Comissions;

use Illuminate\Foundation\Http\FormRequest;

namespace App\Http\Requests\Comissions;

use Illuminate\Foundation\Http\FormRequest;

class StoreComissionsRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Ou alguma lógica de autorização se necessário
    }

    public function rules()
    {
        return [
            'vendedor_id' => 'required|exists:users,id|active', 
            'pedido_id' => 'required|exists:pedidos,id|not_cancelled', 
            'produto_id' => 'required|exists:produtos,id', 
            'valor' => 'required|numeric|min:0.01|max:10000', 
            'quantity' => 'required|integer|min:1|max:1000', 
            'percentual' => 'nullable|numeric|min:0|max:5', 
        ];
    }

    public function messages()
    {
        return [
            'vendedor_id.required' => 'O vendedor deve ser informado.',
            'vendedor_id.exists' => 'O vendedor informado não existe.',
            'vendedor_id.active' => 'O vendedor informado está inativo.',
            
            'pedido_id.required' => 'O pedido deve ser informado.',
            'pedido_id.exists' => 'O pedido informado não existe.',
            'pedido_id.not_cancelled' => 'O pedido informado está cancelado.',
            
            'produto_id.required' => 'O produto deve ser informado.',
            'produto_id.exists' => 'O produto informado não existe.',
            
            'valor.required' => 'O valor da comissão deve ser informado.',
            'valor.numeric' => 'O valor da comissão deve ser um número.',
            'valor.min' => 'O valor da comissão não pode ser menor que 0,01.',
            'valor.max' => 'O valor da comissão não pode ser maior que 10.000.',
            
            'quantity.required' => 'A quantidade deve ser informada.',
            'quantity.integer' => 'A quantidade deve ser um número inteiro.',
            'quantity.min' => 'A quantidade não pode ser menor que 1.',
            'quantity.max' => 'A quantidade não pode ser maior que 1000.',
            
            'percentual.numeric' => 'O percentual da comissão deve ser um número.',
            'percentual.min' => 'O percentual da comissão não pode ser menor que 0.',
            'percentual.max' => 'O percentual da comissão não pode ser maior que 5.',
        ];
    }
}
