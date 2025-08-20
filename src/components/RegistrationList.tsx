import React, { useState, useEffect } from 'react';
import { RegistrationResponse } from '../types/Registration';
import RoleBasedAccess from './RoleBasedAccess';
import useRegistrations from '../hooks/useRegistrations';
import useModal from '../hooks/useModal';

interface RegistrationListProps {
  refreshTrigger?: number;
}

const RegistrationList: React.FC<RegistrationListProps> = ({ refreshTrigger }) => {
  const {
    registrations,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    deleteRegistration,
    updateNotes,
    changePage,
    refresh,
    clearError
  } = useRegistrations();

  const notasModal = useModal();
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationResponse | null>(null);
  const [notas, setNotas] = useState({ nota1: '', nota2: '' });
  const [updatingNotas, setUpdatingNotas] = useState(false);

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      refresh();
    }
  }, [refreshTrigger, refresh]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta matrícula?')) {
      await deleteRegistration(id);
    }
  };

  const handleUpdateNotas = (registration: RegistrationResponse) => {
    setSelectedRegistration(registration);
    setNotas({
      nota1: registration.nota1?.toString() || '',
      nota2: registration.nota2?.toString() || ''
    });
    clearError();
    notasModal.open();
  };

  const submitNotas = async () => {
    if (!selectedRegistration) return;

    setUpdatingNotas(true);
    const success = await updateNotes(selectedRegistration.id, notas);
    
    if (success) {
      notasModal.close();
      setSelectedRegistration(null);
    }
    
    setUpdatingNotas(false);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando matrículas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={refresh} className="btn-retry">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="registration-list">
      <div className="list-header">
        <h2>Lista de Matrículas</h2>
        <div className="list-info">
          <span>{totalElements} matrícula(s) encontrada(s)</span>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma matrícula encontrada</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Aluno</th>
                  <th>Disciplina</th>
                  <th>Nota 1</th>
                  <th>Nota 2</th>
                  <th>Status</th>
                  <th>Data Matrícula</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td>{registration.id}</td>
                    <td>
                      <div className="student-info">
                        <strong>{registration.aluno.nome}</strong>
                        <span className="matricula">Mat: {registration.aluno.matricula}</span>
                      </div>
                    </td>
                    <td>
                      <div className="discipline-info">
                        <strong>{registration.disciplina.nome}</strong>
                        {registration.disciplina.cargaHoraria && (
                          <span className="carga-horaria">{registration.disciplina.cargaHoraria}h</span>
                        )}
                      </div>
                    </td>
                    <td>{registration.nota1 ?? '-'}</td>
                    <td>{registration.nota2 ?? '-'}</td>
                    <td>{getStatusBadge(registration.status)}</td>
                    <td>{formatDate(registration.dataMatricula)}</td>
                    <td>
                      <div className="action-buttons">
                        <RoleBasedAccess allowedRoles={['ROLE_ADMIN', 'ROLE_PROFESSOR']}>
                          <button
                            onClick={() => handleUpdateNotas(registration)}
                            className="btn-action btn-edit"
                            title="Atualizar notas"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </RoleBasedAccess>
                        
                        <RoleBasedAccess allowedRoles={['ROLE_ADMIN']}>
                          <button
                            onClick={() => handleDelete(registration.id)}
                            className="btn-action btn-delete"
                            title="Excluir matrícula"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </RoleBasedAccess>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 0}
                className="pagination-btn"
              >
                Anterior
              </button>
              
              <span className="pagination-info">
                Página {currentPage + 1} de {totalPages}
              </span>
              
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="pagination-btn"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {notasModal.isOpen && selectedRegistration && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Atualizar Notas</h3>
              <button 
                onClick={notasModal.close}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p><strong>Aluno:</strong> {selectedRegistration.aluno.nome}</p>
              <p><strong>Disciplina:</strong> {selectedRegistration.disciplina.nome}</p>
              
              {error && (
                <div className="error-message" style={{ marginBottom: '15px' }}>
                  {error}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="nota1">Nota 1 (0-10):</label>
                <input
                  type="number"
                  id="nota1"
                  min="0"
                  max="10"
                  step="0.1"
                  value={notas.nota1}
                  onChange={(e) => {
                    setNotas(prev => ({ ...prev, nota1: e.target.value }));
                    if (error) clearError();
                  }}
                  disabled={updatingNotas}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nota2">Nota 2 (0-10):</label>
                <input
                  type="number"
                  id="nota2"
                  min="0"
                  max="10"
                  step="0.1"
                  value={notas.nota2}
                  onChange={(e) => {
                    setNotas(prev => ({ ...prev, nota2: e.target.value }));
                    if (error) clearError();
                  }}
                  disabled={updatingNotas}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                onClick={notasModal.close}
                className="btn-secondary"
                disabled={updatingNotas}
              >
                Cancelar
              </button>
              <button
                onClick={submitNotas}
                className="btn-primary"
                disabled={updatingNotas}
              >
                {updatingNotas ? 'Salvando...' : 'Salvar Notas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationList;
