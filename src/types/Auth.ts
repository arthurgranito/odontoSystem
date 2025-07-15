export interface User {
  id: number;
  name: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  senha: string;
}