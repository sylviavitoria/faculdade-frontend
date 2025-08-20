import React, { useState, FormEvent } from 'react';
import { registrationService } from '../service/RegistrationService';
import { RegistrationResponse } from '../types/Registration';

const RegistrationSearchById: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [registration, setRegistration] = useState<RegistrationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setError('Por favor, digite um ID válido');
      return;
    }

    setLoading(true);
    setError(null);
    setRegistration(null);

    try {
      const id = parseInt(searchId);
      if (isNaN(id)) {
        throw new Error('ID deve ser um número válido');
      }

      const result = await registrationService.getById(id);
      setRegistration(result);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar matrícula');
      setRegistration(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; text: string }> = {
      APROVADA: { class: 'success', text: 'Aprovada' },
      REPROVADA: { class: 'error', text: 'Reprovada' },
      PENDENTE: { class: 'warning', text: 'Pendente' }
    };
    
    const statusInfo = statusMap[status] || { class: 'info', text: status };
    
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const clearSearch = () => {
    setSearchId('');
    setRegistration(null);
    setError(null);
    setSearched(false);
  };

  return (
    <div className="registration-search">
      <div className="search-header">
        <h2>Buscar Matrícula por ID</h2>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="searchId">ID da Matrícula:</label>
          <div className="search-input-group">
            <input
              type="number"
              id="searchId"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Digite o ID da matrícula"
              disabled={loading}
              min="1"
            />
            <button 
              type="submit" 
              className="btn-search"
              disabled={loading || !searchId.trim()}
            >
              {loading ? (
                <>
                  <div className="loading-spinner small"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  Buscar
                </>
              )}
            </button>
            {(registration || error || searched) && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="btn-clear"
              >
                <i className="fas fa-times"></i>
                Limpar
              </button>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        </div>
      )}

      {registration && (
        <div className="search-result">
          <div className="registration-card">
            <div className="card-header">
              <h3>Matrícula #{registration.id}</h3>
              <div className="status-container">
                {getStatusBadge(registration.status)}
              </div>
            </div>
            
            <div className="card-body">
              <div className="registration-details">
                <div className="detail-section">
                  <h4>Informações do Aluno</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Nome:</span>
                      <span className="value">{registration.aluno.nome}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Matrícula:</span>
                      <span className="value">{registration.aluno.matricula}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Email:</span>
                      <span className="value">{registration.aluno.email}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Informações da Disciplina</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Nome:</span>
                      <span className="value">{registration.disciplina.nome}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Carga Horária:</span>
                      <span className="value">
                        {registration.disciplina.cargaHoraria ? `${registration.disciplina.cargaHoraria}h` : 'Não informado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Notas e Status</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Nota 1:</span>
                      <span className="value">{registration.nota1 ?? 'Não informada'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Nota 2:</span>
                      <span className="value">{registration.nota2 ?? 'Não informada'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Média:</span>
                      <span className="value">
                        {registration.nota1 && registration.nota2 
                          ? ((registration.nota1 + registration.nota2) / 2).toFixed(2)
                          : 'Não calculada'
                        }
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Data da Matrícula:</span>
                      <span className="value">{formatDate(registration.dataMatricula)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && !registration && !error && (
        <div className="no-results">
          <div className="no-results-message">
            <i className="fas fa-search"></i>
            <p>Nenhuma matrícula encontrada com o ID informado.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationSearchById;
