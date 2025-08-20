import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherSearchById from '../TeacherSearchById';
import { teacherService } from '../../service/TeacherService';

jest.mock('../../service/TeacherService');

describe('TeacherSearchById', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente de busca', () => {
    render(<TeacherSearchById />);
    expect(screen.getByPlaceholderText(/Ex: 1, 2, 3.../i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro se busca falhar', async () => {
    (teacherService.getById as jest.Mock).mockRejectedValue(new Error('Professor não encontrado'));

    render(<TeacherSearchById />);
    const input = screen.getByPlaceholderText(/Ex: 1, 2, 3.../i);
    fireEvent.change(input, { target: { value: '999' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/Professor não encontrado/i)).toBeInTheDocument();
    });
  });
});
