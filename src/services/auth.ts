import api from "./api";
import type { AuthResponse, LoginCredentials, RegisterCredentials } from "../types/Auth";
import { ERROR_MESSAGES, STORAGE_KEYS } from "../constants";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    await api.post<AuthResponse>('/auth/register', credentials);
    // Auto login after registration
    const loginResponse = await login({
      email: credentials.email,
      senha: credentials.senha
    });
    return loginResponse;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw new Error(ERROR_MESSAGES.VALIDATION);
  }
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};