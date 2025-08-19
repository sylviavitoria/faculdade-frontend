import { useState, useCallback } from 'react';
import { DisciplineResponse } from '../types/Discipline';
import { disciplineService } from '../service/DisciplineService';

export const useDisciplineSearch = () => {
  const [discipline, setDiscipline] = useState<DisciplineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    setDiscipline(null);
    setSearched(true);

    try {
      const result = await disciplineService.getById(id);
      setDiscipline(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar disciplina';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDiscipline(null);
    setError(null);
    setSearched(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    discipline,
    loading,
    error,
    searched,

    searchById,
    clear,
    clearError
  };
};

export default useDisciplineSearch;
