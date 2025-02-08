export interface User {
  id: number;
  name: string;
  email: string;
  perfil: string;
}

export interface LoginResponse {
  access_token: string | any;
  user: User;
}

export interface DecodedToken {
  sub: number;
  email: string;
  name: string;
  perfil: string;
  exp: number;
}

export interface loginData {
  email: string;
  password: string;
}

export interface IStatus {
  id: string;
  saldo_inicial: string;
  open_date: string;
  status: string;
}

export interface IMovimentacoes {
  id: string;
  caixa_id: string;
  user_id: string;
  type: string;
  value: number;
  description: string;
  payment_method: null | string;
  status: string;
  additional_data: null | string;
  pedido_id: string;
}
