import React, { useState, useEffect } from 'react';
import RegistrationList from '../components/RegistrationList';
import RegistrationSearchById from '../components/RegistrationSearchById';
import CreateEntity from '../components/generic/CreateEntity';
import RegistrationForm from '../components/form/RegistrationForm';
import RoleBasedAccess from '../components/RoleBasedAccess';
import { useAuth } from '../hooks/useAuth';
import useRegistrationForm from '../hooks/useRegistrationForm';
import '../pages/style/Registration.css';
import './style/Student.css';

const Registration: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'search'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    loadingOptions,
    students,
    disciplines,
    handleChange,
    handleSubmit
  } = useRegistrationForm();

  useEffect(() => {
    if (isSubmitted) {
      setRefreshTrigger(prev => prev + 1);
      setActiveTab('list');
    }
  }, [isSubmitted]);

  const handleTabChange = (tab: 'list' | 'create' | 'search') => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const getDefaultContent = () => {
      if (user?.role === 'ROLE_ALUNO') {
        return 'search';
      }
      return 'list';
    };

    setActiveTab(getDefaultContent());
  }, [user?.role]);

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>Gerenciamento de Matrículas</h1>
        <p>
          {user?.role === 'ROLE_ALUNO' && 'Consulte suas matrículas por ID'}
          {user?.role === 'ROLE_PROFESSOR' && 'Gerencie matrículas: visualize, consulte e atualize notas'}
          {user?.role === 'ROLE_ADMIN' && 'Administre matrículas: crie, visualize, atualize notas e exclua'}
        </p>
      </div>

      <div className="tab-navigation">
        <RoleBasedAccess allowedRoles={['ROLE_ADMIN', 'ROLE_PROFESSOR']}>
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => handleTabChange('list')}
          >
            Lista de Matrículas
          </button>
        </RoleBasedAccess>

        <RoleBasedAccess allowedRoles={['ROLE_ADMIN']}>
          <button
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => handleTabChange('create')}
          >
            Nova Matrícula
          </button>
        </RoleBasedAccess>

        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => handleTabChange('search')}
        >
          Buscar por ID
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'list' && (
          <RoleBasedAccess
            allowedRoles={['ROLE_ADMIN', 'ROLE_PROFESSOR']}
            fallback={
              <div className="access-denied">
                <p>Você não tem permissão para ver a lista de matrículas.</p>
                <p>Use a busca por ID para consultar matrículas específicas.</p>
              </div>
            }
          >
            <RegistrationList refreshTrigger={refreshTrigger} />
          </RoleBasedAccess>
        )}

        {activeTab === 'create' && (
          <RoleBasedAccess
            allowedRoles={['ROLE_ADMIN']}
            fallback={<p>Você não tem permissão para criar novas matrículas.</p>}
          >
            <CreateEntity
              title="Nova Matrícula"
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              FormComponent={RegistrationForm}
              formProps={{ 
                loadingOptions,
                students,
                disciplines,
                submitLabel: { idle: 'Criar Matrícula', submitting: 'Criando...' }
              }}
            />
          </RoleBasedAccess>
        )}

        {activeTab === 'search' && (
          <div className="search-section">
            <RegistrationSearchById />
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
