import { useState, useEffect, useCallback } from 'react';
import { StudentResponse, PageResponse } from '../types/Student';
import { studentService } from '../service/StudentService';

interface UseStudentsOptions {
  pageSize?: number;
  autoLoad?: boolean;
}

export const useStudents = (options: UseStudentsOptions = {}) => {
  const { pageSize = 10, autoLoad = true } = options;

  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadStudents = useCallback(async (page = 0, sort?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: PageResponse<StudentResponse> = await studentService.list(page, pageSize, sort);
      setStudents(response.content);
      setCurrentPage(response.pageable.pageNumber);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar alunos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const deleteStudent = useCallback(async (id: number) => {
    try {
      await studentService.delete(id);
      await loadStudents(currentPage);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar aluno';
      setError(errorMessage);
      return false;
    }
  }, [loadStudents, currentPage]);

  const changePage = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      loadStudents(newPage);
    }
  }, [totalPages, loadStudents]);

  const refresh = useCallback(() => {
    loadStudents(currentPage);
  }, [loadStudents, currentPage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadStudents();
    }
  }, [loadStudents, autoLoad]);

  return {
    students,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    loadStudents,
    deleteStudent,
    changePage,
    refresh,
    clearError
  };
};

export default useStudents;
