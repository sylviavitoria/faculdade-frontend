import { renderHook, act } from '@testing-library/react';
import useStudentSearch from '../useStudentSearch';
import { studentService } from '../../service/StudentService';
import { StudentResponse } from '../../types/Student';

jest.mock('../../service/StudentService');

const mockedStudentService = studentService as jest.Mocked<typeof studentService>;

const studentMock: StudentResponse = {
  id: 1,
  nome: 'Maria',
  email: 'maria@email.com',
  matricula: '2025001',
  senha: '123',
};

describe('useStudentSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicia com valores padrão', () => {
    const { result } = renderHook(() => useStudentSearch());

    expect(result.current.student).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.searched).toBe(false);
  });

  it('realiza busca com sucesso', async () => {
    mockedStudentService.getById.mockResolvedValueOnce(studentMock);

    const { result } = renderHook(() => useStudentSearch());

    await act(async () => {
      await result.current.searchById(1);
    });

    expect(mockedStudentService.getById).toHaveBeenCalledWith(1);
    expect(result.current.student).toEqual(studentMock);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.searched).toBe(true);
  });

  it('define erro ao falhar na busca', async () => {
    mockedStudentService.getById.mockRejectedValueOnce(new Error('Erro teste'));

    const { result } = renderHook(() => useStudentSearch());

    await act(async () => {
      await result.current.searchById(2);
    });

    expect(mockedStudentService.getById).toHaveBeenCalledWith(2);
    expect(result.current.student).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Erro teste');
    expect(result.current.searched).toBe(true);
  });

  it('limpa os dados do student e erro com clear', () => {
    const { result } = renderHook(() => useStudentSearch());

    act(() => {
      result.current.clear();
    });

    expect(result.current.student).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.searched).toBe(false);
  });

  it('limpa apenas o erro com clearError', () => {
    const { result } = renderHook(() => useStudentSearch());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
