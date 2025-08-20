import { renderHook, act, waitFor } from '@testing-library/react';
import useStudents from '../useStudents';
import { studentService } from '../../service/StudentService';
import { StudentResponse, PageResponse } from '../../types/Student';

jest.mock('../../service/StudentService');
const mockedStudentService = studentService as jest.Mocked<typeof studentService>;

const studentsMock: StudentResponse[] = [
  { id: 1, nome: 'Maria', email: 'maria@email.com', matricula: '2025001', senha: '123' },
  { id: 2, nome: 'Bob', email: 'bob@email.com', matricula: '2025002', senha: '123' },
];

const pageMock: PageResponse<StudentResponse> = {
  content: studentsMock,
  pageable: { pageNumber: 0 },
  totalPages: 1,
  totalElements: 2,
};

describe('useStudents', () => {
  beforeEach(() => jest.clearAllMocks());

  it('inicia com valores padrão e carrega automaticamente', async () => {
    mockedStudentService.list.mockResolvedValueOnce(pageMock);

    const { result } = renderHook(() => useStudents());

    expect(result.current.loading).toBe(true);
    expect(result.current.students).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.students).toEqual(studentsMock);
    expect(result.current.totalPages).toBe(1);
  });

  it('carrega estudantes manualmente', async () => {
    mockedStudentService.list.mockResolvedValueOnce(pageMock);
    const { result } = renderHook(() => useStudents({ autoLoad: false }));

    await act(async () => {
      await result.current.loadStudents();
    });

    expect(result.current.students).toEqual(studentsMock);
    expect(result.current.loading).toBe(false);
  });

  it('trata erro ao carregar estudantes', async () => {
    mockedStudentService.list.mockRejectedValueOnce(new Error('Erro teste'));
    const { result } = renderHook(() => useStudents({ autoLoad: false }));

    await act(async () => {
      await result.current.loadStudents();
    });

    expect(result.current.students).toEqual([]);
    expect(result.current.error).toBe('Erro teste');
    expect(result.current.loading).toBe(false);
  });
});
