import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface RoleBasedAccessProps {
  allowedRoles: Array<'ROLE_ADMIN' | 'ROLE_PROFESSOR' | 'ROLE_ALUNO'>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({ 
  allowedRoles, 
  children, 
  fallback 
}) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default RoleBasedAccess;
