// Tipos baseados no payload de exemplo do módulo de etiquetas

export interface EtiquetaAtributo {
  id: number;
  name: string;
  pivot: {
    variante_id: number;
    atributo_id: number;
    valor: string;
    created_at: string;
    updated_at: string;
  };
}

export interface EtiquetaVariante {
  id: number;
  tenant_id: string;
  produto_id: number;
  name: string;
  type: string;
  quantity: number;
  active: number;
  code: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
  atributos: EtiquetaAtributo[];
}

export interface EtiquetaProduto {
  id: number;
  tenant_id: string;
  name: string;
  description: string;
  purchase_price: string;
  selling_price: string;
  quantity: number;
  tipo_de_produto_id: number;
  brand: string;
  code: string;
  categoria_id: number;
  created_at: string;
  updated_at: string;
  variants: EtiquetaVariante[];
}

export interface ProdutoSearchResponse {
  current_page: number;
  data: EtiquetaProduto[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
