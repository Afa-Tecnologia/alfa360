/**
 * Interface para o tipo de produto
 */
export interface TipoDeProduto {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface para o tipo de negócio
 */
export interface TipoDeNegocio {
  id: number;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface para a configuração do negócio
 */
export interface ConfigDoNegocio {
  id: number;
  nome: string;
  logo_url?: string;
  tipos_de_negocios_id: number;
  tipoDeNegocio?: TipoDeNegocio;
  created_at?: string;
  updated_at?: string;
}
