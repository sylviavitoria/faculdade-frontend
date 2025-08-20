import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useRegistrations from '../../hooks/useRegistrations';
import { useAuth } from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import RegistrationList from '../RegistrationList';

jest.mock('../../hooks/useRegistrations');
jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useModal');

const mockUseRegistrations = useRegistrations as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockUseModal = useModal as jest.Mock;

describe('RegistrationList Component', () => {
  const mockOpen = jest.fn();
  const mockClose = jest.fn();

  beforeEach(() => {
    mockUseRegistrations.mockReset();
    mockUseAuth.mockReset();
    mockUseModal.mockReset();

    mockUseAuth.mockReturnValue({
      user: { id: 1, nome: 'Admin', role: 'ROLE_ADMIN' },
      isAuthenticated: true,
    });

    mockUseModal.mockReturnValue({
      isOpen: false,
      open: mockOpen,
      close: mockClose,
    });
  });

  it('deve renderizar título e total de matrículas', () => {
    mockUseRegistrations.mockReturnValue({
      registrations: [
        { 
          id: 1, 
          aluno: { id: 1, nome: 'João Silva' }, 
          disciplina: { id: 1, nome: 'ADS' },
          nota1: 8.5,
          nota2: 7.0,
          status: 'APROVADA'
        }
      ],
      loading: false,
      error: null,
      totalElements: 1,
      currentPage: 0,
      totalPages: 1,
      refresh: jest.fn(),
      deleteRegistration: jest.fn(),
      updateNotes: jest.fn(),
      changePage: jest.fn(),
      clearError: jest.fn(),
    });

    render(<RegistrationList refreshTrigger={0} />);

    expect(screen.getByText('Lista de Matrículas')).toBeInTheDocument();
    expect(screen.getByText('1 matrícula(s) encontrada(s)')).toBeInTheDocument();
  });

  it('deve exibir mensagem de lista vazia', () => {
    mockUseRegistrations.mockReturnValue({
      registrations: [],
      loading: false,
      error: null,
      totalElements: 0,
      currentPage: 0,
      totalPages: 0,
      refresh: jest.fn(),
      deleteRegistration: jest.fn(),
      updateNotes: jest.fn(),
      changePage: jest.fn(),
      clearError: jest.fn(),
    });

    render(<RegistrationList refreshTrigger={0} />);
    expect(screen.getByText('Nenhuma matrícula encontrada')).toBeInTheDocument();
  });

  it('deve exibir mensagem de carregando', () => {
    mockUseRegistrations.mockReturnValue({
      registrations: [],
      loading: true,
      error: null,
      totalElements: 0,
      currentPage: 0,
      totalPages: 0,
      refresh: jest.fn(),
      deleteRegistration: jest.fn(),
      updateNotes: jest.fn(),
      changePage: jest.fn(),
      clearError: jest.fn(),
    });

    render(<RegistrationList refreshTrigger={0} />);
    expect(screen.getByText('Carregando matrículas...')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro e botão tentar novamente', () => {
    const refreshMock = jest.fn();

    mockUseRegistrations.mockReturnValue({
      registrations: [],
      loading: false,
      error: 'Erro ao carregar dados',
      totalElements: 0,
      currentPage: 0,
      totalPages: 0,
      refresh: refreshMock,
      deleteRegistration: jest.fn(),
      updateNotes: jest.fn(),
      changePage: jest.fn(),
      clearError: jest.fn(),
    });

    render(<RegistrationList refreshTrigger={0} />);
    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();

    const tryAgainButton = screen.getByText('Tentar novamente');
    fireEvent.click(tryAgainButton);
    expect(refreshMock).toHaveBeenCalled();
  });
});
