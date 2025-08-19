import { useState, useEffect, useCallback } from 'react';
import { RegistrationResponse, PageResponse } from '../types/Registration';
import { registrationService } from '../service/RegistrationService';

interface UseRegistrationsOptions {
  pageSize?: number;
  autoLoad?: boolean;
}

export const useRegistrations = (options: UseRegistrationsOptions = {}) => {
  const { pageSize = 10, autoLoad = true } = options;

  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadRegistrations = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response: PageResponse<RegistrationResponse> = await registrationService.list(page, pageSize);
      setRegistrations(response.content);
      setCurrentPage(response.pageable.pageNumber);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar matrículas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const deleteRegistration = useCallback(async (id: number) => {
    try {
      await registrationService.delete(id);
      await loadRegistrations(currentPage);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar matrícula';
      setError(errorMessage);
      return false;
    }
  }, [loadRegistrations, currentPage]);

  const updateNotes = useCallback(async (id: number, notas: { nota1: string; nota2: string }) => {
    try {
      const notasData: { nota1?: number; nota2?: number } = {};

      if (notas.nota1 !== '') {
        const nota1 = parseFloat(notas.nota1);
        if (isNaN(nota1) || nota1 < 0 || nota1 > 10) {
          throw new Error('Nota 1 deve ser um número entre 0 e 10');
        }
        notasData.nota1 = nota1;
      }
      
      if (notas.nota2 !== '') {
        const nota2 = parseFloat(notas.nota2);
        if (isNaN(nota2) || nota2 < 0 || nota2 > 10) {
          throw new Error('Nota 2 deve ser um número entre 0 e 10');
        }
        notasData.nota2 = nota2;
      }

      await registrationService.updateNotes(id, notasData);
      await loadRegistrations(currentPage);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar notas';
      setError(errorMessage);
      return false;
    }
  }, [loadRegistrations, currentPage]);

  const changePage = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      loadRegistrations(newPage);
    }
  }, [totalPages, loadRegistrations]);

  const refresh = useCallback(() => {
    loadRegistrations(currentPage);
  }, [loadRegistrations, currentPage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadRegistrations();
    }
  }, [loadRegistrations, autoLoad]);

  return {
    registrations,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,

    loadRegistrations,
    deleteRegistration,
    updateNotes,
    changePage,
    refresh,
    clearError
  };
};

export default useRegistrations;
