export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  access_token: string | any;
  refresh_token: string | any;  
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

