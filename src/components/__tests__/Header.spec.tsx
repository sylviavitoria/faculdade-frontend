import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

const mockLogout = jest.fn();

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      nome: 'Maria',
      email: 'maria@example.com',
      role: 'ROLE_ADMIN',
    },
    logout: mockLogout,
  }),
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título do sistema', () => {
    render(<Header />);
    expect(screen.getByText('Sistema de Faculdade')).toBeInTheDocument();
  });

  it('deve mostrar o nome do usuário logado', () => {
    render(<Header />);
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('deve abrir e fechar o menu do usuário ao clicar no botão', () => {
    render(<Header />);
    const userButton = screen.getByRole('button', { name: /Maria/i });

    fireEvent.click(userButton);
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();

    fireEvent.click(userButton);
    expect(screen.queryByText('maria@example.com')).not.toBeInTheDocument();
  });

  it('deve chamar logout ao clicar em "Sair"', () => {
    render(<Header />);
    const userButton = screen.getByRole('button', { name: /Maria/i });
    fireEvent.click(userButton);

    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1); 
  });

  it('deve exibir botão de menu hamburguer no modo mobile', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    window.dispatchEvent(new Event('resize'));

    render(<Header onMenuToggle={jest.fn()} />);
    expect(screen.getByLabelText(/Toggle menu/i)).toBeInTheDocument();
  });

  it('não deve exibir botão de menu hamburguer em telas grandes', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
    window.dispatchEvent(new Event('resize'));

    render(<Header />);
    expect(screen.queryByLabelText(/Toggle menu/i)).not.toBeInTheDocument();
  });
});
