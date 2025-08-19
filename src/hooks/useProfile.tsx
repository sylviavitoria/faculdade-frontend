import { useState, useEffect, useCallback } from 'react';
import { StudentResponse } from '../types/Student';
import { TeacherResponse } from '../types/Teacher';
import { studentService } from '../service/StudentService';
import { teacherService } from '../service/TeacherService';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<StudentResponse | TeacherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data: StudentResponse | TeacherResponse;
      
      if (user.role === 'ROLE_ALUNO') {
        data = await studentService.getMe();
      } else if (user.role === 'ROLE_PROFESSOR') {
        data = await teacherService.getMe();
      } else {
        throw new Error('Tipo de usuário não suportado para perfil');
      }
      
      setProfileData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do perfil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (user && (user.role === 'ROLE_ALUNO' || user.role === 'ROLE_PROFESSOR')) {
      loadProfile();
    }
  }, [user, loadProfile]);

  return {
    profileData,
    loading,
    error,
    userType: user?.role,

    loadProfile,
    refresh,
    clearError
  };
};

export default useProfile;
