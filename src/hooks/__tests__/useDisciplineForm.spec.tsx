import { act, renderHook } from '@testing-library/react';
import useDisciplineForm from '../useDisciplineForm';
import { disciplineService } from '../../service/DisciplineService';

jest.mock('../../service/DisciplineService');

const mockedDisciplineService = disciplineService as jest.Mocked<typeof disciplineService>;

describe('useDisciplineForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  it('deve iniciar com valores padrão', () => {
    const { result } = renderHook(() => useDisciplineForm());

    expect(result.current.formData).toEqual({
      nome: '',
      codigo: '',
      cargaHoraria: '',
      professorId: undefined,
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSubmitted).toBe(false);
  });

  it('deve atualizar o formData com handleChange', () => {
    const { result } = renderHook(() => useDisciplineForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'nome', value: 'Matemática' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.nome).toBe('Matemática');
  });

  it('deve validar e exibir erro se nome estiver vazio', async () => {
    const { result } = renderHook(() => useDisciplineForm());

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.nome).toBe('Nome é obrigatório');
  });

  it('deve chamar disciplineService.create quando id não existir', async () => {
    mockedDisciplineService.create.mockResolvedValueOnce({ id: 1, nome: 'Matemática' });

    const { result } = renderHook(() => useDisciplineForm());

    act(() => {
      result.current.setFormData({
        nome: 'Matemática',
        codigo: 'MAT101',
        cargaHoraria: 60,
        professorId: 1,
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(mockedDisciplineService.create).toHaveBeenCalledWith({
      nome: 'Matemática',
      codigo: 'MAT101',
      cargaHoraria: 60,
      professorId: 1,
    });
    expect(result.current.isSubmitted).toBe(true);
  });

  it('deve chamar disciplineService.update quando id existir', async () => {
    mockedDisciplineService.update.mockResolvedValueOnce({ id: 2, nome: 'Português' });

    const { result } = renderHook(() => useDisciplineForm());

    act(() => {
      result.current.setFormData({
        id: 2,
        nome: 'Português',
        codigo: 'POR101',
        cargaHoraria: 40,
        professorId: 1,
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(mockedDisciplineService.update).toHaveBeenCalledWith(2, {
      id: 2,
      nome: 'Português',
      codigo: 'POR101',
      cargaHoraria: 40,
      professorId: 1,
    });
    expect(result.current.isSubmitted).toBe(true);
  });

  it('deve lidar com erro no serviço e definir mensagem em errors.form', async () => {
    mockedDisciplineService.create.mockRejectedValueOnce(new Error('Erro no servidor'));

    const { result } = renderHook(() => useDisciplineForm());

    act(() => {
      result.current.setFormData({
        nome: 'Física',
        codigo: 'FIS101',
        cargaHoraria: 30,
        professorId: 1,
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.form).toBe('Erro no servidor');
  });
});
