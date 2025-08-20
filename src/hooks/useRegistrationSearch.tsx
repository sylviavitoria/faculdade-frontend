import { useState, useCallback } from 'react';
import { RegistrationResponse } from '../types/Registration';
import { registrationService } from '../service/RegistrationService';

export const useRegistrationSearch = () => {
  const [registration, setRegistration] = useState<RegistrationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    setRegistration(null);
    setSearched(true);

    try {
      const result = await registrationService.getById(id);
      setRegistration(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar matrícula';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setRegistration(null);
    setError(null);
    setSearched(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    registration,
    loading,
    error,
    searched,

    searchById,
    clear,
    clearError
  };
};

export default useRegistrationSearch;
