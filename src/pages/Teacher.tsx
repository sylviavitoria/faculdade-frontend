import { useState } from 'react';
import CreateTeacher from '../components/CreateTeacher';
import TeacherList from '../components/TeacherList';
import TeacherProfile from '../components/TeacherProfile';
import TeacherSearchById from '../components/TeacherSearchById';
import RoleBasedAccess from '../components/RoleBasedAccess';
import { useAuth } from '../hooks/useAuth';
import { TeacherResponse } from '../types/Teacher';
import './Teacher.css';

const Teacher = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'search'>('list');
  const [editingTeacher, setEditingTeacher] = useState<TeacherResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (teacher: TeacherResponse) => {
    setEditingTeacher(teacher);
    setActiveTab('create');
  };

  const handleTeacherCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('list');
    setEditingTeacher(null);
  };

  if (user?.role === 'ROLE_PROFESSOR') {
    return (
      <div className="student-page">
        <TeacherProfile />
      </div>
    );
  }

  return (
    <div className="student-page">
      <RoleBasedAccess 
          allowedRoles={['ROLE_ADMIN']}
          fallback={
            <div className="access-denied">
              <div className="access-denied-card">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Acesso Restrito</h3>
                <p>Você não tem permissão para acessar esta funcionalidade.</p>
                <p>Apenas administradores podem gerenciar professores.</p>
                <div className="user-info-card">
                  <p><strong>Usuário:</strong> {user?.nome}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Permissão:</strong> {user?.role?.replace('ROLE_', '')}</p>
                </div>
              </div>
            </div>
          }
        >
          <div className="page-header">
            <h1>Gerenciamento de Professores</h1>
            <p>Cadastre e gerencie professores do sistema</p>
          </div>

            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('list');
                  setEditingTeacher(null);
                }}
              >
                <i className="fas fa-list"></i>
                Lista de Professores
              </button>
              <button 
                className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('search');
                  setEditingTeacher(null);
                }}
              >
                <i className="fas fa-search"></i>
                Buscar por ID
              </button>
              <button 
                className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                <i className="fas fa-plus"></i>
                {editingTeacher ? 'Editar Professor' : 'Cadastrar Professor'}
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'list' && (
                <TeacherList 
                  onEdit={handleEdit}
                  refreshTrigger={refreshTrigger}
                />
              )}
              
              {activeTab === 'search' && (
                <TeacherSearchById />
              )}
              
              {activeTab === 'create' && (
                <CreateTeacher 
                  editingTeacher={editingTeacher}
                  onTeacherSaved={handleTeacherCreated}
                />
              )}
            </div>
        </RoleBasedAccess>
    </div>
  );
};

export default Teacher;
