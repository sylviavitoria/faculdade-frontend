import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextProvider';
import { AuthContextType } from '../types/Auth';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
