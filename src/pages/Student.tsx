import { useState } from 'react';
import CreateStudent from '../components/CreateStudent';
import StudentList from '../components/StudentList';
import RoleBasedAccess from '../components/RoleBasedAccess';
import { useAuth } from '../hooks/useAuth';
import { StudentResponse } from '../types/Student';
import './Student.css';

const Student = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
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

  return (
    <>
      <div className="content">
        <RoleBasedAccess 
          allowedRoles={['ROLE_ADMIN']}
          fallback={
            <div className="access-denied">
              <div className="access-denied-card">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Acesso Restrito</h3>
                <p>Você não tem permissão para acessar esta funcionalidade.</p>
                <p>Apenas administradores podem gerenciar alunos.</p>
                <div className="user-info-card">
                  <p><strong>Usuário:</strong> {user?.nome}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Permissão:</strong> {user?.role?.replace('ROLE_', '')}</p>
                </div>
              </div>
            </div>
          }
        >
          <div className="student-management">
            <div className="page-header">
              <h1>Gerenciamento de Alunos</h1>
              <p>Cadastre e gerencie alunos do sistema</p>
            </div>

            <div className="tab-navigation">
              <button 
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
                className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                <i className="fas fa-plus"></i>
                {editingStudent ? 'Editar Aluno' : 'Cadastrar Aluno'}
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'list' && (
                <StudentList 
                  onEdit={handleEdit}
                  refreshTrigger={refreshTrigger}
                />
              )}
              
              {activeTab === 'create' && (
                <CreateStudent 
                  editingStudent={editingStudent}
                  onStudentSaved={handleStudentCreated}
                />
              )}
            </div>
          </div>
        </RoleBasedAccess>
      </div>
    </>
  );
};

export default Student;
