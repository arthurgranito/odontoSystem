import React, { createContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { 
  login as apiLogin, 
  register as apiRegister, 
  logout as apiLogout,
  getStoredToken,
  setStoredToken
} from "../services/auth";
import type { User, LoginCredentials, RegisterCredentials } from "../types/Auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    const token = getStoredToken();
    if (token) {
      setIsAuthenticated(true);
      // TODO: Validate token with backend and get user info
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await apiLogin(credentials);
      setStoredToken(data.token);
      setIsAuthenticated(true);
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const data = await apiRegister(credentials);
      setStoredToken(data.token);
      setIsAuthenticated(true);
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    apiLogout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login: signIn,
    register: signUp,
    logout: signOut,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};