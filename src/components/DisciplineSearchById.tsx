import React from 'react';
import { DisciplineResponse } from '../types/Discipline';
import useDisciplineSearch from '../hooks/useDisciplineSearch';
import SearchById from './SearchById';

interface DisciplineSearchResultProps {
  discipline: DisciplineResponse | null;
  error: string | null;
  onClear: () => void;
}

const DisciplineSearchResult: React.FC<DisciplineSearchResultProps> = ({ discipline, error, onClear }) => {
  if (error) {
    return (
      <div className="search-result error-result" data-testid="discipline-error">
        <div className="error-card">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Erro na busca</h3>
          <p>{error}</p>
          <button onClick={onClear} className="btn btn-secondary" data-testid="discipline-clear-button">
            <i className="fas fa-times"></i>
            Limpar
          </button>
        </div>
      </div>
    );
  }

  if (!discipline) return null;

  return (
    <div className="search-result success-result" data-testid="discipline-result">
      <div className="result-card">
        <div className="result-header">
          <h3>
            <i className="fas fa-book"></i>
            Disciplina Encontrada
          </h3>
          <button onClick={onClear} className="btn btn-link clear-btn" data-testid="discipline-clear-button">
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
  const { discipline, loading, error, searchById, clear } = useDisciplineSearch();

  return (
    <div className="discipline-search">
      <div className="search-section">
        <h2>Buscar Disciplina por ID</h2>
        <SearchById
          onSearch={searchById}
          isLoading={loading}
          placeholder="Digite o ID da disciplina"
          label="ID da Disciplina"
          data-testid="discipline-search-input"
        />
      </div>

      <div className="result-section">
        <DisciplineSearchResult discipline={discipline} error={error} onClear={clear} />
      </div>
    </div>
  );
};

export default DisciplineSearchById;
