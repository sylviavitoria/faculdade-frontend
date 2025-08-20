import { renderHook, act } from '@testing-library/react';
import useStudentForm from '../useStudentForm';
import { studentService } from '../../service/StudentService';
import { StudentFormData } from '../../types/Student';

jest.mock('../../service/StudentService');

const mockedStudentService = studentService as jest.Mocked<typeof studentService>;

const studentMock: StudentFormData = {
  id: 1,
  nome: 'Maria',
  email: 'maria@email.com',
  matricula: '2025001',
  senha: '123',
};

describe('useStudentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('inicia com valores padrão', () => {
    const { result } = renderHook(() => useStudentForm());

    expect(result.current.formData).toEqual({
      nome: '',
      email: '',
      matricula: '',
      senha: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSubmitted).toBe(false);
  });

  it('atualiza o formData com handleChange', () => {
    const { result } = renderHook(() => useStudentForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'nome', value: 'Maria' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.nome).toBe('Maria');
  });

  it('valida o formulário e exibe erros', async () => {
    const { result } = renderHook(() => useStudentForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.nome).toBe('Nome é obrigatório');
    expect(result.current.errors.email).toBe('E-mail é obrigatório');
    expect(result.current.errors.matricula).toBe('Número de matrícula é obrigatório');
    expect(result.current.errors.senha).toBe('Senha é obrigatória');
  });

  it('cria aluno com sucesso', async () => {
    mockedStudentService.create.mockResolvedValueOnce(studentMock);

    const { result } = renderHook(() => useStudentForm());

    act(() => {
      result.current.setFormData({
        nome: 'Maria',
        email: 'maria@email.com',
        matricula: '2025001',
        senha: '123',
      });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(mockedStudentService.create).toHaveBeenCalledWith({
      nome: 'Maria',
      email: 'maria@email.com',
      matricula: '2025001',
      senha: '123',
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.formData).toEqual({
      nome: '',
      email: '',
      matricula: '',
      senha: '',
    });
  });

  it('atualiza aluno existente com sucesso', async () => {
    mockedStudentService.update.mockResolvedValueOnce(studentMock);

    const { result } = renderHook(() => useStudentForm());

    act(() => {
      result.current.setFormData(studentMock);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(mockedStudentService.update).toHaveBeenCalledWith(1, studentMock);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isSubmitted).toBe(false);
  });

  it('define erro ao falhar na criação/atualização', async () => {
    mockedStudentService.create.mockRejectedValueOnce(new Error('Erro teste'));

    const { result } = renderHook(() => useStudentForm());

    act(() => {
      result.current.setFormData({
        nome: 'Bob',
        email: 'bob@email.com',
        matricula: '2025002',
        senha: '123',
      });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.form).toBe('Erro teste');
  });
});
