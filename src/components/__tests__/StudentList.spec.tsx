import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentList from '../StudentList';
import { StudentResponse } from '../../types/Student';
import { useAuth } from '../../hooks/useAuth';
import useStudents from '../../hooks/useStudents';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useStudents');

const mockStudents: StudentResponse[] = [
  { id: 1, nome: 'Maria', email: 'maria@example.com', matricula: '2023001' },
  { id: 2, nome: 'Bob', email: 'bob@example.com', matricula: '2023002' },
];

describe('StudentList', () => {
  const useAuthMock = useAuth as jest.Mock;
  const useStudentsMock = useStudents as jest.Mock;

  const deleteStudentMock = jest.fn();
  const changePageMock = jest.fn();
  const refreshMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuthMock.mockReturnValue({ user: { role: 'ROLE_ADMIN' } });
    useStudentsMock.mockReturnValue({
      students: mockStudents,
      loading: false,
      error: '',
      currentPage: 0,
      totalPages: 1,
      totalElements: mockStudents.length,
      deleteStudent: deleteStudentMock,
      changePage: changePageMock,
      refresh: refreshMock,
    });
  });

  it('deve mostrar loading quando loading for true', () => {
    useStudentsMock.mockReturnValueOnce({ ...useStudentsMock(), loading: true });

    render(<StudentList />);
    expect(screen.getByText(/Carregando alunos.../i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem de lista vazia', () => {
    useStudentsMock.mockReturnValueOnce({ ...useStudentsMock(), students: [] });

    render(<StudentList />);
    expect(screen.getByText(/Nenhum aluno cadastrado ainda/i)).toBeInTheDocument();
  });

  it('deve renderizar alunos corretamente', () => {
    render(<StudentList />);
    mockStudents.forEach(student => {
      expect(screen.getByText(student.nome)).toBeInTheDocument();
      expect(screen.getByText(student.email)).toBeInTheDocument();
      expect(screen.getByText(student.matricula)).toBeInTheDocument();
    });
  });

  it('deve chamar onEdit ao clicar no botão de editar', () => {
    const onEditMock = jest.fn();
    render(<StudentList onEdit={onEditMock} />);

    const editButtons = screen.getAllByTitle(/Editar aluno/i);
    fireEvent.click(editButtons[0]);

    expect(onEditMock).toHaveBeenCalledWith(mockStudents[0]);
  });

  it('deve chamar deleteStudent ao confirmar deleção', async () => {
    window.confirm = jest.fn(() => true); 
    render(<StudentList />);

    const deleteButtons = screen.getAllByTitle(/Deletar aluno/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteStudentMock).toHaveBeenCalledWith(mockStudents[0].id);
    });
  });

  it('não deve chamar deleteStudent se usuário cancelar', async () => {
    window.confirm = jest.fn(() => false); 
    render(<StudentList />);

    const deleteButtons = screen.getAllByTitle(/Deletar aluno/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteStudentMock).not.toHaveBeenCalled();
    });
  });

  it('deve chamar changePage ao clicar em botões de paginação', () => {
    useStudentsMock.mockReturnValueOnce({
      ...useStudentsMock(),
      totalPages: 3,
      currentPage: 1,
    });

    render(<StudentList />);

    const prevButton = screen.getByText(/Anterior/i);
    const nextButton = screen.getByText(/Próxima/i);

    fireEvent.click(prevButton);
    expect(changePageMock).toHaveBeenCalledWith(0);

    fireEvent.click(nextButton);
    expect(changePageMock).toHaveBeenCalledWith(2);
  });

  it('deve chamar refresh quando refreshTrigger mudar', () => {
    const { rerender } = render(<StudentList refreshTrigger={0} />);
    rerender(<StudentList refreshTrigger={1} />);
    expect(refreshMock).toHaveBeenCalled();
  });
});
