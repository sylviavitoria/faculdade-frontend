import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentSearchById from '../StudentSearchById';
import { useAuth } from '../../hooks/useAuth';
import useStudentSearch from '../../hooks/useStudentSearch';
import '@testing-library/jest-dom';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useStudentSearch');

describe('StudentSearchById', () => {
  const mockUser = { role: 'ROLE_PROFESSOR' };
  const mockStudent = {
    id: 1,
    nome: 'Maria Souza',
    email: 'maria@example.com',
    matricula: '2023001',
  };

  const mockSearchById = jest.fn();
  const mockClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useStudentSearch as jest.Mock).mockReturnValue({
      student: null,
      loading: false,
      error: null,
      searchById: mockSearchById,
      clear: mockClear,
    });
  });

  it('deve renderizar o input de busca', () => {
    render(<StudentSearchById />);
    expect(screen.getByTestId('search-by-id-input')).toBeInTheDocument();
    expect(screen.getByText(/Buscar Estudante por ID/i)).toBeInTheDocument();
  });

  it('deve chamar searchById ao submeter um ID', () => {
    render(<StudentSearchById />);
    const input = screen.getByTestId('search-by-id-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.submit(input.closest('form')!);
    expect(mockSearchById).toHaveBeenCalledWith(1);
  });

  it('deve mostrar loading quando loading for true', () => {
    (useStudentSearch as jest.Mock).mockReturnValue({
      student: null,
      loading: true,
      error: null,
      searchById: mockSearchById,
      clear: mockClear,
    });
    render(<StudentSearchById />);

    const button = screen.getByRole('button', { name: /Buscando/i });
    expect(button).toBeDisabled();
  });

  it('deve mostrar mensagem de erro quando houver erro', () => {
    const errorMsg = 'Aluno não encontrado';
    (useStudentSearch as jest.Mock).mockReturnValue({
      student: null,
      loading: false,
      error: errorMsg,
      searchById: mockSearchById,
      clear: mockClear,
    });
    render(<StudentSearchById />);
    expect(screen.getByTestId('search-error')).toBeInTheDocument();
    expect(screen.getByText(errorMsg)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('clear-error-btn'));
    expect(mockClear).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar os dados do aluno corretamente', () => {
    (useStudentSearch as jest.Mock).mockReturnValue({
      student: mockStudent,
      loading: false,
      error: null,
      searchById: mockSearchById,
      clear: mockClear,
    });
    render(<StudentSearchById />);

    const resultCard = screen.getByTestId('search-success');
    expect(resultCard).toBeInTheDocument();
    expect(screen.getByTestId('student-id')).toHaveTextContent('1');
    expect(screen.getByTestId('student-name')).toHaveTextContent('Maria Souza');
    expect(screen.getByTestId('student-email')).toHaveTextContent('maria@example.com');
    expect(screen.getByTestId('student-matricula')).toHaveTextContent('2023001');

    fireEvent.click(screen.getByTestId('clear-success-btn'));
    expect(mockClear).toHaveBeenCalledTimes(1);
  });
});
