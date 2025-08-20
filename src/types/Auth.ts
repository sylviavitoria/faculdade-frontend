export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  tipo: string;
  expiresIn: number;
  usuario: UserInfo;
}

export interface UserInfo {
  id: number;
  nome: string;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_PROFESSOR' | 'ROLE_ALUNO';
}

export interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
