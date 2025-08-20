import React from 'react';
import { StudentResponse } from '../types/Student';
import { useAuth } from '../hooks/useAuth';
import useStudentSearch from '../hooks/useStudentSearch';
import SearchById from './SearchById';

interface StudentSearchResultProps {
  student: StudentResponse | null;
  error: string | null;
  onClear: () => void;
}

const StudentSearchResult: React.FC<StudentSearchResultProps> = ({ student, error, onClear }) => {
  if (error) {
    return (
      <div className="search-result error-result" data-testid="search-error">
        <div className="error-card">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Erro na busca</h3>
          <p>{error}</p>
          <button onClick={onClear} className="btn btn-secondary" data-testid="clear-error-btn">
            <i className="fas fa-times"></i>
            Limpar
          </button>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="search-result success-result" data-testid="search-success">
      <div className="result-card">
        <div className="result-header">
          <h3>
            <i className="fas fa-user-graduate"></i>
            Estudante Encontrado
          </h3>
          <button onClick={onClear} className="btn btn-link clear-btn" data-testid="clear-success-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="student-details">
          <div className="detail-group">
            <label>
              <i className="fas fa-id-badge"></i>
              ID:
            </label>
            <span data-testid="student-id">{student.id}</span>
          </div>
          
          <div className="detail-group">
            <label>
              <i className="fas fa-user"></i>
              Nome:
            </label>
            <span data-testid="student-name">{student.nome}</span>
          </div>
          
          <div className="detail-group">
            <label>
              <i className="fas fa-envelope"></i>
              Email:
            </label>
            <span data-testid="student-email">{student.email}</span>
          </div>
          
          <div className="detail-group">
            <label>
              <i className="fas fa-id-card"></i>
              Matrícula:
            </label>
            <span data-testid="student-matricula">{student.matricula}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentSearchById: React.FC = () => {
  const { user } = useAuth();
  const { student, loading, error, searchById, clear } = useStudentSearch();

  return (
    <div className="student-search-by-id">
      <div className="search-section">
        <div className="search-header">
          <h2>
            <i className="fas fa-search"></i>
            Buscar Estudante por ID
          </h2>
          <p>Digite o ID do estudante para visualizar suas informações</p>
          {user?.role === 'ROLE_PROFESSOR' && (
            <div className="info-note" style={{ 
              background: 'var(--info-bg, #e3f2fd)', 
              border: '1px solid var(--info, #2196f3)', 
              padding: '0.75rem 1rem', 
              borderRadius: '6px', 
              marginTop: '1rem' 
            }}>
              <i className="fas fa-info-circle" style={{ color: 'var(--info, #2196f3)' }}></i>
              <span style={{ marginLeft: '0.5rem', color: 'var(--info-dark, #1976d2)' }}>
                Como professor, você tem acesso às informações dos alunos para acompanhar o progresso acadêmico.
              </span>
            </div>
          )}
        </div>

        <SearchById
          onSearch={searchById}
          isLoading={loading}
          placeholder="Ex: 1, 2, 3..."
          label="ID do Estudante"
          data-testid="search-by-id-input"
        />
      </div>

      <StudentSearchResult 
        student={student}
        error={error}
        onClear={clear}
      />
    </div>
  );
};

export default StudentSearchById;
