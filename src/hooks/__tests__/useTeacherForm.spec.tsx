import { renderHook, act } from '@testing-library/react';
import { ChangeEvent, FormEvent } from 'react';
import useTeacherForm from '../useTeacherForm';
import { teacherService } from '../../service/TeacherService';

jest.mock('../../service/TeacherService');

const mockTeacherService = teacherService as jest.Mocked<typeof teacherService>;

describe('useTeacherForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const createChangeEvent = (name: string, value: string): ChangeEvent<HTMLInputElement> => {
    return {
      target: { name, value },
    } as ChangeEvent<HTMLInputElement>;
  };

  const createFormEvent = (): FormEvent<HTMLFormElement> => {
    return {
      preventDefault: () => {},
    } as FormEvent<HTMLFormElement>;
  };

  it('valida o formulário corretamente', () => {
    const { result } = renderHook(() => useTeacherForm());

    act(() => {
      result.current.handleSubmit(createFormEvent());
    });

    expect(result.current.errors.nome).toBe('Nome é obrigatório');
    expect(result.current.errors.email).toBe('E-mail é obrigatório');
    expect(result.current.errors.senha).toBe('Senha é obrigatória');

    act(() => {
      result.current.handleChange(createChangeEvent('nome', 'Test'));
      result.current.handleChange(createChangeEvent('email', 'teste'));
      result.current.handleChange(createChangeEvent('senha', '12'));
    });

    act(() => {
      result.current.handleSubmit(createFormEvent());
    });

    expect(result.current.errors.email).toBe('Formato de e-mail inválido');
    expect(result.current.errors.senha).toBe('A senha deve ter pelo menos 3 caracteres');
  });

  it('submete formulário com sucesso', async () => {
    mockTeacherService.create.mockResolvedValueOnce({ id: 1, nome: 'Test', email: 'test@test.com', senha: '123' });
    const { result } = renderHook(() => useTeacherForm());

    act(() => {
      result.current.handleChange(createChangeEvent('nome', 'Test'));
      result.current.handleChange(createChangeEvent('email', 'test@test.com'));
      result.current.handleChange(createChangeEvent('senha', '123'));
    });

    await act(async () => {
      await result.current.handleSubmit(createFormEvent());
    });

    expect(result.current.isSubmitted).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.formData).toEqual({ nome: '', email: '', senha: '' });
  });

  it('define erro quando falha o serviço', async () => {
    mockTeacherService.create.mockRejectedValueOnce(new Error('Erro teste'));
    const { result } = renderHook(() => useTeacherForm());

    act(() => {
      result.current.handleChange(createChangeEvent('nome', 'Test'));
      result.current.handleChange(createChangeEvent('email', 'test@test.com'));
      result.current.handleChange(createChangeEvent('senha', '123'));
    });

    await act(async () => {
      await result.current.handleSubmit(createFormEvent());
    });

    expect(result.current.errors.form).toBe('Erro teste');
    expect(result.current.isSubmitting).toBe(false);
  });
});
