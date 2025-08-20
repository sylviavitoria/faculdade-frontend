import { renderHook, act, waitFor } from '@testing-library/react';
import useTeachers from '../useTeachers';
import { teacherService } from '../../service/TeacherService';
import { TeacherResponse, PageResponse } from '../../types/Teacher';

jest.mock('../../service/TeacherService');

const mockedTeacherService = teacherService as jest.Mocked<typeof teacherService>;

const teachersMock: TeacherResponse[] = [
  { id: 1, nome: 'Maria', email: 'maria@email.com', createdAt: '2025-01-01', updatedAt: '2025-01-02' },
];

const pageResponseMock: PageResponse<TeacherResponse> = {
  content: teachersMock,
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

describe('useTeachers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('carrega professores automaticamente', async () => {
    mockedTeacherService.list.mockResolvedValueOnce(pageResponseMock);

    const { result } = renderHook(() => useTeachers());

    await waitFor(() => {
      expect(result.current.teachers).toEqual(teachersMock);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('falha ao carregar professores', async () => {
    mockedTeacherService.list.mockRejectedValueOnce(new Error('Erro teste'));

    const { result } = renderHook(() => useTeachers());

    await waitFor(() => {
      expect(result.current.error).toBe('Erro teste');
      expect(result.current.loading).toBe(false);
    });
  });

  it('deleta professor com sucesso', async () => {
    mockedTeacherService.delete.mockResolvedValue();
    mockedTeacherService.list.mockResolvedValue(pageResponseMock);

    const { result } = renderHook(() => useTeachers());

    await act(async () => {
      const success = await result.current.deleteTeacher(1);
      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(mockedTeacherService.delete).toHaveBeenCalledWith(1);
    });
  });

  it('falha ao deletar professor', async () => {
    mockedTeacherService.delete.mockRejectedValueOnce(new Error('Erro delete'));

    const { result } = renderHook(() => useTeachers());

    await act(async () => {
      const success = await result.current.deleteTeacher(1);
      expect(success).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Erro delete');
    });
  });

  it('troca de página corretamente', async () => {
    mockedTeacherService.list.mockResolvedValue(pageResponseMock);

    const { result } = renderHook(() => useTeachers({ autoLoad: false }));

    await act(async () => {
      result.current.changePage(0);
    });

    expect(result.current.currentPage).toBe(0);
  });

  it('limpa erros', () => {
    const { result } = renderHook(() => useTeachers());
    
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('refresh chama loadTeachers', async () => {
    mockedTeacherService.list.mockResolvedValue(pageResponseMock);

    const { result } = renderHook(() => useTeachers({ autoLoad: false }));

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.teachers).toEqual(teachersMock);
    });
  });
});
