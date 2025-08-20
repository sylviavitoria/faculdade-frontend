import React, { useState } from 'react';
import { TeacherResponse } from '../types/Teacher';
import { teacherService } from '../service/TeacherService';
import SearchById from './SearchById';

interface TeacherSearchResultProps {
  teacher: TeacherResponse | null;
  error: string | null;
  onClear: () => void;
}

const TeacherSearchResult: React.FC<TeacherSearchResultProps> = ({ teacher, error, onClear }) => {
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

  if (!teacher) return null;

  return (
    <div className="search-result success-result">
      <div className="result-card">
        <div className="result-header">
          <h3>
            <i className="fas fa-chalkboard-teacher"></i>
            Professor Encontrado
          </h3>
          <button onClick={onClear} className="btn btn-link clear-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="teacher-details">
          <div className="detail-group">
            <label>
              <i className="fas fa-id-badge"></i>
              ID:
            </label>
            <span>{teacher.id}</span>
          </div>
          
          <div className="detail-group">
            <label>
              <i className="fas fa-user"></i>
              Nome:
            </label>
            <span>{teacher.nome}</span>
          </div>
          
          <div className="detail-group">
            <label>
              <i className="fas fa-envelope"></i>
              Email:
            </label>
            <span>{teacher.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherSearchById: React.FC = () => {
  const [teacher, setTeacher] = useState<TeacherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (id: number) => {
    setIsLoading(true);
    setError(null);
    setTeacher(null);

    try {
      const result = await teacherService.getById(id);
      setTeacher(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar professor';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTeacher(null);
    setError(null);
  };

  return (
    <div className="teacher-search-by-id">
      <div className="search-section">
        <div className="search-header">
          <h2>
            <i className="fas fa-search"></i>
            Buscar Professor por ID
          </h2>
          <p>Digite o ID do professor para visualizar suas informações</p>
        </div>

        <SearchById
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Ex: 1, 2, 3..."
          label="ID do Professor"
        />
      </div>

      <TeacherSearchResult 
        teacher={teacher}
        error={error}
        onClear={handleClear}
      />
    </div>
  );
};

export default TeacherSearchById;
