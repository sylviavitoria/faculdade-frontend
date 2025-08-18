import React, { useState, useEffect, ReactNode } from 'react';
import { UserInfo, AuthContextType } from '../types/Auth';
import { AuthContext } from './AuthContextProvider';
import AuthService from '../service/AuthService';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = AuthService.getToken();
        const savedUser = AuthService.getUserInfo();

        if (savedToken && savedUser && typeof savedUser === 'object' && savedUser.id) {
          setToken(savedToken);
          setUser(savedUser);
        } else {
          AuthService.clearTokens();
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        AuthService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, senha: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, senha });
      console.log('Resposta completa do login:', response);
      
      AuthService.saveTokens(response);
      setToken(response.accessToken);
      setUser(response.usuario);
      
      console.log('Login realizado com sucesso no contexto:', { 
        user: response.usuario,
        token: response.accessToken ? 'Token presente' : 'Token ausente',
        userSet: response.usuario ? 'Usuário definido' : 'Usuário indefinido'
      });
    } catch (error) {
      console.error('Erro no login (contexto):', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    AuthService.clearTokens();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
