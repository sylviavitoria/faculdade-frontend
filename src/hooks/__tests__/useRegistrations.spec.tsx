import { renderHook, act, waitFor } from '@testing-library/react';
import useRegistrations from '../useRegistrations';
import { registrationService } from '../../service/RegistrationService';
import { RegistrationResponse, PageResponse } from '../../types/Registration';

jest.mock('../../service/RegistrationService');

const mockRegistrationService = registrationService as jest.Mocked<typeof registrationService>;

const registrationsMock: RegistrationResponse[] = [
  { id: 1, alunoId: 1, disciplinaId: 1, nota1: 8, nota2: 9, createdAt: '2025-01-01', updatedAt: '2025-01-02' }
];

const pageResponseMock: PageResponse<RegistrationResponse> = {
  content: registrationsMock,
  pageable: { pageNumber: 0, pageSize: 10, offset: 0, paged: true, unpaged: false, sort: { sorted: false, unsorted: true, empty: true } },
  totalPages: 1,
  totalElements: 1,
  last: true,
  first: true,
  size: 10,
  number: 0,
  sort: { sorted: false, unsorted: true, empty: true },
  numberOfElements: 1,
  empty: false
};

describe('useRegistrations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deleta registro com sucesso', async () => {
    mockRegistrationService.list.mockResolvedValue(pageResponseMock);
    mockRegistrationService.delete.mockResolvedValue();

    const { result } = renderHook(() => useRegistrations());

    await act(async () => {
      const success = await result.current.deleteRegistration(1);
      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.registrations).toEqual(registrationsMock);
      expect(result.current.currentPage).toBe(0);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.totalElements).toBe(1);
      expect(result.current.loading).toBe(false);
    });
  });

  it('falha ao deletar registro', async () => {
    mockRegistrationService.delete.mockRejectedValueOnce(new Error('Erro teste'));
    const { result } = renderHook(() => useRegistrations());

    await act(async () => {
      const success = await result.current.deleteRegistration(1);
      expect(success).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Erro teste');
      expect(result.current.loading).toBe(false);
    });
  });

  it('atualiza notas com sucesso', async () => {
    mockRegistrationService.list.mockResolvedValue(pageResponseMock);
    mockRegistrationService.updateNotas.mockResolvedValue();

    const { result } = renderHook(() => useRegistrations());

    await act(async () => {
      const success = await result.current.updateNotes(1, { nota1: '7', nota2: '8' });
      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('define erro ao atualizar notas inválidas', async () => {
    const { result } = renderHook(() => useRegistrations());

    await act(async () => {
      const success = await result.current.updateNotes(1, { nota1: '11', nota2: '8' });
      expect(success).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Nota 1 deve ser um número entre 0 e 10');
      expect(result.current.loading).toBe(false);
    });
  });

  it('troca de página corretamente', async () => {
    mockRegistrationService.list.mockResolvedValue(pageResponseMock);
    const { result } = renderHook(() => useRegistrations({ pageSize: 10, autoLoad: false }));

    await act(async () => {
      result.current.changePage(0);
    });

    await waitFor(() => {
      expect(result.current.currentPage).toBe(0);
    });
  });

  it('limpa erros', async () => {
    const { result } = renderHook(() => useRegistrations());

    await act(async () => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
