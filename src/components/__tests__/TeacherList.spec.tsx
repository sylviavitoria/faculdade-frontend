import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TeacherList from '../TeacherList';
import { teacherService } from '../../service/TeacherService';
import { useAuth } from '../../hooks/useAuth';
import { TeacherResponse } from '../../types/Teacher';

jest.mock('../../service/TeacherService');
jest.mock('../../hooks/useAuth');

describe('TeacherList', () => {
  const mockTeachers: TeacherResponse[] = [
    { id: 1, nome: 'Maria', email: 'maria@example.com' },
    { id: 2, nome: 'Bob', email: 'bob@example.com' },
  ];

  const mockUserAdmin = { role: 'ROLE_ADMIN' };
  const mockUserProfessor = { role: 'ROLE_PROFESSOR' };

  beforeEach(() => {
    jest.clearAllMocks();
    (teacherService.list as jest.Mock).mockResolvedValue({
      content: mockTeachers,
      pageable: { pageNumber: 0 },
      totalPages: 1,
      totalElements: mockTeachers.length,
    });
  });

  it('deve mostrar loading enquanto carrega', async () => {
    (teacherService.list as jest.Mock).mockImplementation(() => new Promise(() => {}));
    (useAuth as jest.Mock).mockReturnValue({ user: mockUserAdmin });
    render(<TeacherList />);
    expect(screen.getByText(/Carregando professores/i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro se falhar ao carregar', async () => {
    (teacherService.list as jest.Mock).mockRejectedValue(new Error('Erro de conexão'));
    (useAuth as jest.Mock).mockReturnValue({ user: mockUserAdmin });

    render(<TeacherList />);
    await waitFor(() => {
      expect(screen.getByText(/Erro de conexão/i)).toBeInTheDocument();
    });
  });

  it('deve mostrar estado vazio quando não houver professores', async () => {
    (teacherService.list as jest.Mock).mockResolvedValue({
      content: [],
      pageable: { pageNumber: 0 },
      totalPages: 0,
      totalElements: 0,
    });
    (useAuth as jest.Mock).mockReturnValue({ user: mockUserAdmin });

    render(<TeacherList />);
    await waitFor(() => {
      expect(screen.getByText(/Nenhum professor cadastrado/i)).toBeInTheDocument();
    });
  });

  it('deve renderizar lista sem ações para professor', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUserProfessor });

    render(<TeacherList />);
    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.queryByTitle('Editar professor')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Deletar professor')).not.toBeInTheDocument();
    });
  });

  it('deve chamar onEdit ao clicar no botão de editar', async () => {
    const onEditMock = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUserAdmin });

    render(<TeacherList onEdit={onEditMock} />);
    await waitFor(() => {
      const editButtons = screen.getAllByTitle('Editar professor');
      fireEvent.click(editButtons[0]);
      expect(onEditMock).toHaveBeenCalledWith(mockTeachers[0]);
    });
  });

  it('deve deletar professor e recarregar lista', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUserAdmin });
    (teacherService.delete as jest.Mock).mockResolvedValue({});
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<TeacherList />);
    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Deletar professor');
      fireEvent.click(deleteButtons[0]);
      expect(teacherService.delete).toHaveBeenCalledWith(1);
    });
  });

  it('não deve deletar se o confirm for cancelado', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUserAdmin });
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(<TeacherList />);
    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Deletar professor');
      fireEvent.click(deleteButtons[0]);
      expect(teacherService.delete).not.toHaveBeenCalled();
    });
  });

  it('deve navegar entre páginas', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUserAdmin });
    (teacherService.list as jest.Mock).mockResolvedValueOnce({
      content: mockTeachers,
      pageable: { pageNumber: 0 },
      totalPages: 2,
      totalElements: 12,
    });

    render(<TeacherList />);
    await waitFor(() => {
      const nextButton = screen.getByText(/Próxima/i);
      fireEvent.click(nextButton);
      expect(teacherService.list).toHaveBeenCalledWith(1, 10);
    });
  });
});
