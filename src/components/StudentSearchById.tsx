import React, { useState } from 'react';
import { StudentResponse } from '../types/Student';
import { studentService } from '../service/StudentService';
import { useAuth } from '../hooks/useAuth';
import SearchById from './SearchById';

interface StudentSearchResultProps {
  student: StudentResponse | null;
  error: string | null;
  onClear: () => void;
}

const StudentSearchResult: React.FC<StudentSearchResultProps> = ({ student, error, onClear }) => {
  if (error) {
    return (
      <div className="search-result error-result">
        <div className="error-card">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Erro na busca</h3>
          <p>{error}</p>
          <button onClick={onClear} className="btn btn-secondary">
            <i className="fas fa-times"></i>
            Limpar
          </button>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="search-result success-result">
      <div className="result-card">
        <div className="result-header">
          <h3>
            <i className="fas fa-user-graduate"></i>
            Estudante Encontrado
          </h3>
          <button onClick={onClear} className="btn btn-link clear-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="student-details">
          <div className="detail-group">
            <label>
              <i className="fas fa-id-badge"></i>
              ID:
            </label>
            <span>{student.id}</span>
          </div>
          
          <div className="detail-group">
            <label>
              <i className="fas fa-user"></i>
              Nome:
            </label>
            <span>{student.nome}</span>
          </div>
          
          <div className="detail-group">
            <label>
              <i className="fas fa-envelope"></i>
              Email:
            </label>
            <span>{student.email}</span>
          </div>
          
          <div className="detail-group">
            <label>
              <i className="fas fa-id-card"></i>
              Matrícula:
            </label>
            <span>{student.matricula}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentSearchById: React.FC = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (id: number) => {
    setIsLoading(true);
    setError(null);
    setStudent(null);

    try {
      const result = await studentService.getById(id);
      setStudent(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar estudante';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setStudent(null);
    setError(null);
  };

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
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Ex: 1, 2, 3..."
          label="ID do Estudante"
        />
      </div>

      <StudentSearchResult 
        student={student}
        error={error}
        onClear={handleClear}
      />
    </div>
  );
};

export default StudentSearchById;
