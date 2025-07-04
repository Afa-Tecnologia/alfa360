<?php

namespace App\Http\Requests\Empresa;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmpresaRequest extends FormRequest
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
            'cnpj' => 'required|string|max:18|unique:empresas,cnpj',
            'razao_social' => 'required|string|max:255',
            'nome_fantasia' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:empresas,email',
            'telefone' => 'nullable|string|max:20',
            'endereco' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:100',
            'estado' => 'nullable|string|size:2',
            'cep' => 'nullable|string|size:8',
            'logo' => 'nullable|url|max:255',
            'dominio' => 'required|string|max:255|unique:empresas,dominio',
            'slug' => 'required|string|max:255|unique:empresas,slug',
            'ativo' => 'required|boolean',
            'trial_expira_em' => 'nullable|date',
            'assinatura_expira_em' => 'nullable|date|after_or_equal:trial_expira_em',
            'owner_id' => 'required|exists:users,id',
            'plano_id' => 'required|exists:planos,id',
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome da empresa é obrigatório.',
            'nome.max' => 'O nome da empresa não pode ter mais que 255 caracteres.',

            'cnpj.required' => 'O CNPJ é obrigatório.',
            'cnpj.unique' => 'Este CNPJ já está em uso.',
            'cnpj.max' => 'O CNPJ deve ter no máximo 18 caracteres.',

            'razao_social.required' => 'A razão social é obrigatória.',

            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'O e-mail informado não é válido.',
            'email.unique' => 'Este e-mail já está em uso.',

            'telefone.max' => 'O telefone deve ter no máximo 20 caracteres.',

            'estado.size' => 'O estado deve conter exatamente 2 letras (ex: CE).',

            'cep.size' => 'O CEP deve conter exatamente 8 dígitos (sem traço).',

            'logo.url' => 'A URL do logo deve ser válida.',

            'dominio.required' => 'O domínio é obrigatório.',
            'dominio.unique' => 'Este domínio já está em uso.',

            'slug.required' => 'O slug é obrigatório.',
            'slug.unique' => 'Este slug já está em uso.',

            'ativo.required' => 'O campo ativo é obrigatório.',
            'ativo.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',

            'assinatura_expira_em.after_or_equal' => 'A data de expiração da assinatura deve ser igual ou posterior ao fim do período de teste.',

            'owner_id.required' => 'O ID do dono é obrigatório.',
            'owner_id.exists' => 'O usuário proprietário não foi encontrado.',

            'plano_id.required' => 'O plano é obrigatório.',
            'plano_id.exists' => 'O plano selecionado não foi encontrado.',
        ];
    }
}
