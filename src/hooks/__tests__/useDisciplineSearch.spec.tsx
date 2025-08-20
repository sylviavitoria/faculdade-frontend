import { renderHook, act } from '@testing-library/react';
import useDisciplineSearch from '../useDisciplineSearch';
import { disciplineService } from '../../service/DisciplineService';
import { DisciplineResponse } from '../../types/Discipline';

jest.mock('../../service/DisciplineService');

const mockedDisciplineService = disciplineService as jest.Mocked<typeof disciplineService>;

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('useDisciplineSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicializa com estados padrão', () => {
    const { result } = renderHook(() => useDisciplineSearch());

    expect(result.current.discipline).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.searched).toBe(false);
  });

  it('realiza busca por ID com sucesso', async () => {
    const mockDiscipline: DisciplineResponse = {
      id: 1,
      nome: 'Matemática',
      codigo: 'MAT101',
      cargaHoraria: 60,
      professorId: 1
    };

    mockedDisciplineService.getById.mockResolvedValueOnce(mockDiscipline);

    const { result } = renderHook(() => useDisciplineSearch());

    await act(async () => {
      await result.current.searchById(1);
    });

    expect(mockedDisciplineService.getById).toHaveBeenCalledWith(1);
    expect(result.current.discipline).toEqual(mockDiscipline);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.searched).toBe(true);
  });

  it('define erro quando getById falha', async () => {
    mockedDisciplineService.getById.mockRejectedValueOnce(new Error('Erro de API'));

    const { result } = renderHook(() => useDisciplineSearch());

    await act(async () => {
      await result.current.searchById(1);
    });

    expect(result.current.discipline).toBeNull();
    expect(result.current.error).toBe('Erro de API');
    expect(result.current.loading).toBe(false);
    expect(result.current.searched).toBe(true);
  });

  it('clear reseta os estados', () => {
    const { result } = renderHook(() => useDisciplineSearch());

    act(() => {
      result.current.clear();
    });

    expect(result.current.discipline).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.searched).toBe(false);
  });

  it('clearError reseta apenas o erro', () => {
    const { result } = renderHook(() => useDisciplineSearch());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
