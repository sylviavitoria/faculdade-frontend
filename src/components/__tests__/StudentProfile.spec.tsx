import React from 'react';
import { render, screen} from '@testing-library/react';
import StudentProfile from '../StudentProfile';
import useProfile from '../../hooks/useProfile';
import { StudentResponse } from '../../types/Student';

jest.mock('../../hooks/useProfile');

const mockProfile: StudentResponse = {
  id: 1,
  nome: 'Maria Souza',
  matricula: '2023001',
  email: 'maria@example.com',
};

describe('StudentProfile', () => {
  const useProfileMock = useProfile as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve mostrar loading quando carregando', () => {
    useProfileMock.mockReturnValue({ profileData: null, loading: true, error: '' });
    render(<StudentProfile />);
    expect(screen.getByText(/Carregando perfil/i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando houver erro', () => {
    useProfileMock.mockReturnValue({ profileData: null, loading: false, error: 'Erro ao carregar perfil' });
    render(<StudentProfile />);
    expect(screen.getByText(/Erro ao carregar perfil/i)).toBeInTheDocument();
  });

  it('deve renderizar os dados do aluno corretamente', () => {
  useProfileMock.mockReturnValue({ profileData: mockProfile, loading: false, error: '' });
  render(<StudentProfile />);

  expect(screen.getByTestId('student-name')).toHaveTextContent(mockProfile.nome);
  expect(screen.getByTestId('student-fullname')).toHaveTextContent(mockProfile.nome);
  expect(screen.getByTestId('student-email')).toHaveTextContent(mockProfile.email);
  expect(screen.getByTestId('student-matricula')).toHaveTextContent(mockProfile.matricula);

    expect(screen.getByText(/Para alterar seus dados/i)).toBeInTheDocument();
  });
});
