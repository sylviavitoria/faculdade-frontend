import { LoginRequest, LoginResponse, UserInfo } from '../types/Auth';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(this.getErrorMessage(response.status));
    }

    const data = await response.json();
    
    if (!data.accessToken || !data.usuario) {
      throw new Error('Resposta inválida do servidor');
    }

    const loginResponse: LoginResponse = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tipo: data.tipo || 'Bearer',
      expiresIn: data.expiresIn || 86400,
      usuario: {
        ...data.usuario,
        nome: data.usuario.nome || data.usuario.email.split('@')[0], 
        role: `ROLE_${data.usuario.tipo}` as 'ROLE_ADMIN' | 'ROLE_PROFESSOR' | 'ROLE_ALUNO'
      }
    };

    this.saveTokens(loginResponse);
    return loginResponse;
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch {
        // ✅ Ignora erros de logout no servidor
      }
    }
    this.clearTokens();
  }

  saveTokens(loginResponse: LoginResponse): void {
    localStorage.setItem('accessToken', loginResponse.accessToken);
    if (loginResponse.refreshToken) {
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
    }
    localStorage.setItem('userInfo', JSON.stringify(loginResponse.usuario));
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUserInfo(): UserInfo | null {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch {
      return null;
    }
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case 401: return 'Email ou senha incorretos';
      case 404: return 'Serviço não encontrado';
      case 500: return 'Erro interno do servidor';
      default: return 'Erro ao fazer login';
    }
  }
}

export default new AuthService();