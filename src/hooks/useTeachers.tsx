import { useState, useEffect, useCallback } from 'react';
import { TeacherResponse, PageResponse } from '../types/Teacher';
import { teacherService } from '../service/TeacherService';

interface UseTeachersOptions {
  pageSize?: number;
  autoLoad?: boolean;
}

export const useTeachers = (options: UseTeachersOptions = {}) => {
  const { pageSize = 10, autoLoad = true } = options;

  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadTeachers = useCallback(async (page = 0, sort?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: PageResponse<TeacherResponse> = await teacherService.list(page, pageSize, sort);
      setTeachers(response.content);
      setCurrentPage(response.pageable.pageNumber);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar professores';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const deleteTeacher = useCallback(async (id: number) => {
    try {
      await teacherService.delete(id);
      await loadTeachers(currentPage);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar professor';
      setError(errorMessage);
      return false;
    }
  }, [loadTeachers, currentPage]);

  const changePage = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      loadTeachers(newPage);
    }
  }, [totalPages, loadTeachers]);

  const refresh = useCallback(() => {
    loadTeachers(currentPage);
  }, [loadTeachers, currentPage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadTeachers();
    }
  }, [loadTeachers, autoLoad]);

  return {
    teachers,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    loadTeachers,
    deleteTeacher,
    changePage,
    refresh,
    clearError
  };
};

export default useTeachers;
