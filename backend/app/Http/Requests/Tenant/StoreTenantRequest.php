<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
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
        return [
            'nome' => 'required|string|max:255',
            'subdominio' => 'required|string|max:255|unique:tenants,subdominio',
            'plano_id' => 'required|integer|exists:planos,id',
            'assinatura_expira_em' => 'nullable|date',
        ];
    }
    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nome.required' => 'O nome do tenant é obrigatório.',
            'subdominio.required' => 'O subdomínio é obrigatório.',
            'subdominio.unique' => 'O subdomínio já está em uso.',
            'plano_id.required' => 'O plano é obrigatório.',
            'plano_id.exists' => 'O plano selecionado não existe.',
            'assinatura_expira_em.date' => 'A data de expiração da assinatura deve ser uma data válida.',
        ];
    }
}
