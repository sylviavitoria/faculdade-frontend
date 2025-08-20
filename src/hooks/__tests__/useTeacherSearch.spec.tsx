import { renderHook, act, waitFor } from '@testing-library/react';
import useTeacherSearch from '../useTeacherSearch';
import { teacherService } from '../../service/TeacherService';
import { TeacherResponse } from '../../types/Teacher';

jest.mock('../../service/TeacherService');

const mockedTeacherService = teacherService as jest.Mocked<typeof teacherService>;

const teacherMock: TeacherResponse = {
  id: 1,
  nome: 'Maria',
  email: 'maria@email.com',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-02',
};

describe('useTeacherSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicia com valores padrão', () => {
    const { result } = renderHook(() => useTeacherSearch());

    expect(result.current.teacher).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.searched).toBe(false);
  });

  it('busca professor por ID com sucesso', async () => {
    mockedTeacherService.getById.mockResolvedValueOnce(teacherMock);

    const { result } = renderHook(() => useTeacherSearch());

    await act(async () => {
      await result.current.searchById(1);
    });

    await waitFor(() => {
      expect(result.current.teacher).toEqual(teacherMock);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.searched).toBe(true);
    });
  });

  it('define erro quando busca falha', async () => {
    mockedTeacherService.getById.mockRejectedValueOnce(new Error('Erro teste'));

    const { result } = renderHook(() => useTeacherSearch());

    await act(async () => {
      await result.current.searchById(1);
    });

    await waitFor(() => {
      expect(result.current.teacher).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Erro teste');
      expect(result.current.searched).toBe(true);
    });
  });

  it('limpa o professor e erros', () => {
    const { result } = renderHook(() => useTeacherSearch());

    act(() => {
      result.current.clear();
    });

    expect(result.current.teacher).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.searched).toBe(false);
  });

  it('limpa apenas o erro', () => {
    const { result } = renderHook(() => useTeacherSearch());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
