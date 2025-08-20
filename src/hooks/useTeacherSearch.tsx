import { useState, useCallback } from 'react';
import { TeacherResponse } from '../types/Teacher';
import { teacherService } from '../service/TeacherService';

export const useTeacherSearch = () => {
  const [teacher, setTeacher] = useState<TeacherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    setTeacher(null);
    setSearched(true);

    try {
      const result = await teacherService.getById(id);
      setTeacher(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar professor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setTeacher(null);
    setError(null);
    setSearched(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    teacher,
    loading,
    error,
    searched,
    searchById,
    clear,
    clearError
  };
};

export default useTeacherSearch;
