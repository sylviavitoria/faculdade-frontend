import { useState, useEffect, useCallback } from 'react';
import { DisciplineResponse, PageResponse } from '../types/Discipline';
import { disciplineService } from '../service/DisciplineService';

interface UseDisciplinesOptions {
  pageSize?: number;
  autoLoad?: boolean;
}

export const useDisciplines = (options: UseDisciplinesOptions = {}) => {
  const { pageSize = 10, autoLoad = true } = options;

  const [disciplines, setDisciplines] = useState<DisciplineResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadDisciplines = useCallback(async (page = 0, sort?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: PageResponse<DisciplineResponse> = await disciplineService.list(page, pageSize, sort);
      setDisciplines(response.content);
      setCurrentPage(response.pageable.pageNumber);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar disciplinas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const deleteDiscipline = useCallback(async (id: number) => {
    try {
      await disciplineService.delete(id);
      await loadDisciplines(currentPage);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar disciplina';
      setError(errorMessage);
      return false;
    }
  }, [loadDisciplines, currentPage]);

  const changePage = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      loadDisciplines(newPage);
    }
  }, [totalPages, loadDisciplines]);

  const refresh = useCallback(() => {
    loadDisciplines(currentPage);
  }, [loadDisciplines, currentPage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadDisciplines();
    }
  }, [loadDisciplines, autoLoad]);

  return {
    disciplines,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,

    loadDisciplines,
    deleteDiscipline,
    changePage,
    refresh,
    clearError
  };
};

export default useDisciplines;
