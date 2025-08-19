import React, { useState } from 'react';
import { DisciplineResponse } from '../types/Discipline';
import { disciplineService } from '../service/DisciplineService';
import SearchById from './SearchById';

interface DisciplineSearchResultProps {
  discipline: DisciplineResponse | null;
  error: string | null;
  onClear: () => void;
}

const DisciplineSearchResult: React.FC<DisciplineSearchResultProps> = ({ discipline, error, onClear }) => {
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

  if (!discipline) return null;

  return (
    <div className="search-result success-result">
      <div className="result-card">
        <div className="result-header">
          <h3>
            <i className="fas fa-book"></i>
            Disciplina Encontrada
          </h3>
          <button onClick={onClear} className="btn btn-link clear-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="discipline-details">
          <div className="detail-group">
            <label>
              <i className="fas fa-id-badge"></i>
              ID:
            </label>
            <span>{discipline.id}</span>
          </div>

          <div className="detail-group">
            <label>
              <i className="fas fa-book-open"></i>
              Nome:
            </label>
            <span>{discipline.nome}</span>
          </div>

          <div className="detail-group">
            <label>
              <i className="fas fa-code"></i>
              Código:
            </label>
            <span>{discipline.codigo}</span>
          </div>

          <div className="detail-group">
            <label>
              <i className="fas fa-chalkboard-teacher"></i>
              Professor:
            </label>
            <span>{discipline.professor?.nome || 'Não atribuído'}</span>
          </div>

          {discipline.professor && (
            <div className="detail-group">
              <label>
                <i className="fas fa-envelope"></i>
                Email do Professor:
              </label>
              <span>{discipline.professor.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DisciplineSearchById: React.FC = () => {
  const [discipline, setDiscipline] = useState<DisciplineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (id: number) => {
    console.log('Buscando disciplina com ID:', id);
    setIsLoading(true);
    setError(null);
    setDiscipline(null);

    try {
      const result = await disciplineService.getById(id);
      console.log('Disciplina encontrada:', result);
      setDiscipline(result);
    } catch (err) {
      console.error('Erro ao buscar disciplina:', err);
      const errorMessage = err instanceof Error ? err.message : 'Disciplina não encontrada';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setDiscipline(null);
    setError(null);
  };

  return (
    <div className="discipline-search">
      <div className="search-section">
        <h2>Buscar Disciplina por ID</h2>
        <SearchById
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Digite o ID da disciplina"
          label="ID da Disciplina"
        />
      </div>

      <div className="result-section">
        <DisciplineSearchResult
          discipline={discipline}
          error={error}
          onClear={handleClear}
        />
      </div>
    </div>
  );
};

export default DisciplineSearchById;
