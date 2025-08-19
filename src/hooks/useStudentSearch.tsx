import { useState, useCallback } from 'react';
import { StudentResponse } from '../types/Student';
import { studentService } from '../service/StudentService';

export const useStudentSearch = () => {
  const [student, setStudent] = useState<StudentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    setStudent(null);
    setSearched(true);

    try {
      const result = await studentService.getById(id);
      setStudent(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar aluno';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setStudent(null);
    setError(null);
    setSearched(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    student,
    loading,
    error,
    searched,
    searchById,
    clear,
    clearError
  };
};

export default useStudentSearch;
