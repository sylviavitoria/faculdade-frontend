import { renderHook, act, waitFor } from '@testing-library/react';
import useRegistrationSearch from '../useRegistrationSearch';
import { registrationService } from '../../service/RegistrationService';
import { RegistrationResponse } from '../../types/Registration';

jest.mock('../../service/RegistrationService');

const mockRegistrationService = registrationService as jest.Mocked<typeof registrationService>;

const registrationMock: RegistrationResponse = {
  id: 1,
  alunoId: 1,
  disciplinaId: 1,
  nota1: 8,
  nota2: 9,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-02'
};

describe('useRegistrationSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca matrícula por ID com sucesso', async () => {
    mockRegistrationService.getById.mockResolvedValueOnce(registrationMock);

    const { result } = renderHook(() => useRegistrationSearch());

    await act(async () => {
      await result.current.searchById(1);
    });

    await waitFor(() => {
      expect(result.current.registration).toEqual(registrationMock);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.searched).toBe(true);
    });
  });

  it('define erro ao buscar matrícula que falha', async () => {
    mockRegistrationService.getById.mockRejectedValueOnce(new Error('Erro teste'));

    const { result } = renderHook(() => useRegistrationSearch());

    await act(async () => {
      await result.current.searchById(1);
    });

    await waitFor(() => {
      expect(result.current.registration).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Erro teste');
      expect(result.current.searched).toBe(true);
    });
  });

  it('limpa matrícula, erro e flag de pesquisa', () => {
    const { result } = renderHook(() => useRegistrationSearch());

    act(() => {
      result.current.clear();
    });

    expect(result.current.registration).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.searched).toBe(false);
  });

  it('limpa apenas o erro', () => {
    const { result } = renderHook(() => useRegistrationSearch());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
