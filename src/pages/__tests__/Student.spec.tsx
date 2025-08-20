import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Student from '../Student';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');
jest.mock('../../components/StudentList', () => ({
  __esModule: true,
  default: jest.fn(() => <div>StudentList Component</div>),
}));
jest.mock('../../components/StudentProfile', () => ({
  __esModule: true,
  default: jest.fn(() => <div>StudentProfile Component</div>),
}));
jest.mock('../../components/CreateStudent', () => ({
  __esModule: true,
  default: jest.fn(() => <div>CreateStudent Component</div>),
}));
jest.mock('../../components/StudentSearchById', () => ({
  __esModule: true,
  default: jest.fn(() => <div>StudentSearchById Component</div>),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe('Student Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ROLE_ALUNO vê apenas StudentProfile', async () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ALUNO', nome: 'Aluno Teste', email: 'aluno@teste.com' } });

    await act(async () => render(<Student />));

    expect(screen.getByText('StudentProfile Component')).toBeInTheDocument();
    expect(screen.queryByText('StudentList Component')).not.toBeInTheDocument();
  });

  it('ROLE_ADMIN vê todas as abas e alterna entre elas', async () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ADMIN' } });

    await act(async () => render(<Student />));

    expect(screen.getByRole('button', { name: /Lista de Alunos/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar Aluno/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buscar por ID/ })).toBeInTheDocument();

    expect(screen.getByText('StudentList Component')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Aluno/ }));
    expect(screen.getByText('CreateStudent Component')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Buscar por ID/ }));
    expect(screen.getByText('StudentSearchById Component')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Lista de Alunos/ }));
    expect(screen.getByText('StudentList Component')).toBeInTheDocument();
  });
});
