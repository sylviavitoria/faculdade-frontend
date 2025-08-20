import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Teacher from '../Teacher';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');
jest.mock('../../components/TeacherList', () => ({
  __esModule: true,
  default: jest.fn(() => <div>TeacherList Component</div>),
}));
jest.mock('../../components/TeacherProfile', () => ({
  __esModule: true,
  default: jest.fn(() => <div>TeacherProfile Component</div>),
}));
jest.mock('../../components/CreateTeacher', () => ({
  __esModule: true,
  default: jest.fn(() => <div>CreateTeacher Component</div>),
}));
jest.mock('../../components/TeacherSearchById', () => ({
  __esModule: true,
  default: jest.fn(() => <div>TeacherSearchById Component</div>),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe('Teacher Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ROLE_PROFESSOR vê apenas TeacherProfile', async () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_PROFESSOR', nome: 'Prof Teste', email: 'prof@teste.com' } });

    await act(async () => render(<Teacher />));

    expect(screen.getByText('TeacherProfile Component')).toBeInTheDocument();
    expect(screen.queryByText('TeacherList Component')).not.toBeInTheDocument();
  });

  it('ROLE_ADMIN vê todas as abas e alterna entre elas', async () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ADMIN' } });

    await act(async () => render(<Teacher />));

    expect(screen.getByRole('button', { name: /Lista de Professores/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar Professor/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buscar por ID/ })).toBeInTheDocument();

    expect(screen.getByText('TeacherList Component')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Professor/ }));
    expect(screen.getByText('CreateTeacher Component')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Buscar por ID/ }));
    expect(screen.getByText('TeacherSearchById Component')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Lista de Professores/ }));
    expect(screen.getByText('TeacherList Component')).toBeInTheDocument();
  });
});
