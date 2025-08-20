import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Disciplines from '../Disciplines';
import { useAuth } from '../../hooks/useAuth';
import { disciplineService } from '../../service/DisciplineService';
import { teacherService } from '../../service/TeacherService';

jest.mock('../../hooks/useAuth');
jest.mock('../../service/DisciplineService');
jest.mock('../../service/TeacherService');

const mockedUseAuth = useAuth as jest.Mock;

describe('Disciplines Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (disciplineService.list as jest.Mock).mockResolvedValue({
      content: [],
      pageable: { pageNumber: 0 },
      totalPages: 1,
    });

    (teacherService.list as jest.Mock).mockResolvedValue({
      content: [],
      pageable: { pageNumber: 0 },
      totalPages: 1,
    });
  });

  it('renderiza corretamente para ROLE_ADMIN', async () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ADMIN' } });

    await act(async () => {
      render(<Disciplines />);
    });

    expect(screen.getByRole('button', { name: 'Lista de Disciplinas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cadastrar Disciplina' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar por ID' })).toBeInTheDocument();

    expect(await screen.findByRole('heading', { level: 2, name: 'Lista de Disciplinas' })).toBeInTheDocument();
  });

  it('ROLE_ALUNO não vê botão de criação', async () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ALUNO' } });

    await act(async () => {
      render(<Disciplines />);
    });

    expect(screen.queryByRole('button', { name: /Cadastrar Disciplina|Editar Disciplina/ })).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Lista de Disciplinas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar por ID' })).toBeInTheDocument();
  });

  it('alterna entre tabs corretamente', async () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ADMIN' } });

    await act(async () => {
      render(<Disciplines />);
    });

    const listTab = screen.getByRole('button', { name: 'Lista de Disciplinas' });
    const createTab = screen.getByRole('button', { name: 'Cadastrar Disciplina' });
    const searchTab = screen.getByRole('button', { name: 'Buscar por ID' });

    expect(await screen.findByRole('heading', { level: 2, name: 'Lista de Disciplinas' })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(createTab);
    });
    expect(await screen.findByText('Cadastrar Nova Disciplina')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(searchTab);
    });
    expect(await screen.findByText('Buscar Disciplina por ID')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(listTab);
    });
    expect(await screen.findByRole('heading', { level: 2, name: 'Lista de Disciplinas' })).toBeInTheDocument();
  });
});
