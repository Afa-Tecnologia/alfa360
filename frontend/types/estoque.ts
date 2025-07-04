export interface IEstoque {
  products?: Product[] | any;
  children?: React.ReactElement;
}

export type Product = {
  id?: number;
  name?: string;
  description?: string;
  type?: string;
  purchase_price?: number;
  selling_price?: number;
  quantity?: number;
  categoria_id?: number | string;
  brand?:string,
  code?:string,
  variants?: Variant[];
};

export interface Atributos {
  name: string;
  pivot: {
    atributo_id: string | number;
    valor: string;
    variante_id?: string | number;
  };
}

export interface AtributosForm {
  atributo_id: string | number;
  valor: string;
}


export type Variant = {
  id?: number;
  produto_id?: number;
  name?: string | any;
  type?: string;
  color?: string | string[];
  size?: string | string[];
  quantity?: number;
  active?: boolean;
  atributos?: Atributos[];
  images: string[]
};

// Tipo utilitário para atributos de formulário de variante (compatível com o zod)
export type AtributoRequest = {
  atributo_id: string | number;
  valor: string;
};
