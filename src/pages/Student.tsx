import { useState } from 'react';
import CreateStudent from '../components/CreateStudent';
import StudentList from '../components/StudentList';
import StudentProfile from '../components/StudentProfile';
import StudentSearchById from '../components/StudentSearchById';
import RoleBasedAccess from '../components/RoleBasedAccess';
import { useAuth } from '../hooks/useAuth';
import { StudentResponse } from '../types/Student';
import '../pages/style/Student.css';

const Student = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'search'>('list');
  const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (student: StudentResponse) => {
    setEditingStudent(student);
    setActiveTab('create');
  };

  const handleStudentCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('list');
    setEditingStudent(null);
  };

  if (user?.role === 'ROLE_ALUNO') {
    return (
      <div className="student-page">
        <StudentProfile />
      </div>
    );
  }

  return (
    <div className="student-page">
      <RoleBasedAccess 
        allowedRoles={['ROLE_ADMIN', 'ROLE_PROFESSOR']}
        fallback={
          <div className="access-denied" id="access-denied">
            <div className="access-denied-card">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Acesso Restrito</h3>
              <p>Você não tem permissão para acessar esta funcionalidade.</p>
              <p>Apenas administradores e professores podem gerenciar alunos.</p>
              <div className="user-info-card" id="user-info-card">
                <p><strong>Usuário:</strong> {user?.nome}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Permissão:</strong> {user?.role?.replace('ROLE_', '')}</p>
              </div>
            </div>
          </div>
        }
      >
        <div className="page-header" id="student-header">
          <h1>Gerenciamento de Alunos</h1>
          <p>
            {user?.role === 'ROLE_ADMIN' 
              ? 'Cadastre e gerencie alunos do sistema' 
              : 'Visualize informações dos alunos'
            }
          </p>
        </div>

        <div className="tab-navigation" id="student-tabs">
          <button 
            id="tab-list"
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('list');
              setEditingStudent(null);
            }}
          >
            <i className="fas fa-list"></i>
            Lista de Alunos
          </button>
          <button 
            id="tab-search"
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('search');
              setEditingStudent(null);
            }}
          >
            <i className="fas fa-search"></i>
            Buscar por ID
          </button>
          {user?.role === 'ROLE_ADMIN' && (
            <button 
              id="tab-create"
              className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              <i className="fas fa-plus"></i>
              {editingStudent ? 'Editar Aluno' : 'Cadastrar Aluno'}
            </button>
          )}
        </div>

        <div className="tab-content" id="student-tab-content">
          {activeTab === 'list' && (
            <StudentList 
              onEdit={user?.role === 'ROLE_ADMIN' ? handleEdit : undefined}
              refreshTrigger={refreshTrigger}
              id="student-list"
            />
          )}
          
          {activeTab === 'search' && (
            <StudentSearchById id="student-search" />
          )}
          
          {activeTab === 'create' && user?.role === 'ROLE_ADMIN' && (
            <CreateStudent 
              editingStudent={editingStudent}
              onStudentSaved={handleStudentCreated}
              id="student-create"
            />
          )}
        </div>
      </RoleBasedAccess>
    </div>
  );
};

export default Student;
