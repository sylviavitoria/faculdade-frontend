import React, { useState } from 'react';
import Banner from '../components/Banner';
import RegistrationList from '../components/RegistrationList';
import CreateEntity from '../components/generic/CreateEntity';
import RegistrationForm from '../components/form/RegistrationForm';
import RegistrationSearchById from '../components/RegistrationSearchById';
import RoleBasedAccess from '../components/RoleBasedAccess';
import useRegistrationForm from '../hooks/useRegistrationForm';
import './Registration.css';

const Registration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'search'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    students,
    disciplines,
    loadingOptions,
    handleChange,
    handleSubmit: originalHandleSubmit
  } = useRegistrationForm();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await originalHandleSubmit(e);
    if (!errors.form) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return (
          <RoleBasedAccess 
            allowedRoles={['ROLE_ADMIN']}
            fallback={
              <div className="access-denied">
                <p>Apenas administradores podem criar matrículas.</p>
              </div>
            }
          >
            <CreateEntity
              title="Criar Nova Matrícula"
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              FormComponent={RegistrationForm}
              formProps={{
                students,
                disciplines,
                loadingOptions,
                submitLabel: { idle: 'Criar Matrícula', submitting: 'Criando...' }
              }}
            />
          </RoleBasedAccess>
        );
      case 'search':
        return <RegistrationSearchById />;
      default:
        return <RegistrationList refreshTrigger={refreshTrigger} />;
    }
  };

  return (
    <div className="registration-page">
      <Banner
        title="Gerenciamento de Matrículas"
        description="Gerencie matrículas de alunos em disciplinas, acompanhe notas e status acadêmico dos estudantes."
      />

      <div className="content-container">
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <i className="fas fa-list"></i>
            Lista de Matrículas
          </button>
          
          <RoleBasedAccess allowedRoles={['ROLE_ADMIN']}>
            <button
              className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              <i className="fas fa-plus"></i>
              Criar Matrícula
            </button>
          </RoleBasedAccess>
          
          <button
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <i className="fas fa-search"></i>
            Buscar por ID
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Registration;
