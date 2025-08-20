import { useState, useEffect } from 'react';
import { teacherService } from '../service/TeacherService';
import { TeacherResponse, PageResponse } from '../types/Teacher';
import { useAuth } from '../hooks/useAuth';
import './style/Tables.css';

interface TeacherListProps {
  onEdit?: (teacher: TeacherResponse) => void;
  refreshTrigger?: number;
}

const TeacherList = ({ onEdit, refreshTrigger }: TeacherListProps) => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const loadTeachers = async (page = 0) => {
    setLoading(true);
    setError('');

    try {
      const response: PageResponse<TeacherResponse> = await teacherService.list(page, pageSize);
      setTeachers(response.content);
      setCurrentPage(response.pageable.pageNumber);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar professores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [refreshTrigger]);

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja deletar o professor ${nome}?`)) {
      return;
    }

    try {
      await teacherService.delete(id);
      loadTeachers(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar professor');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadTeachers(newPage);
    }
  };

  if (loading) {
    return <div className="loading">Carregando professores...</div>;
  }

  return (
    <div className="teacher-list">
      <div className="list-header">
        <h3>Lista de Professores</h3>
        <p>Total: {totalElements} professores cadastrados</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {teachers.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum professor cadastrado ainda.</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  {user?.role === 'ROLE_ADMIN' && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.id}</td>
                    <td>{teacher.nome}</td>
                    <td>{teacher.email}</td>
                    {user?.role === 'ROLE_ADMIN' && (
                      <td>
                        <div className="action-buttons">
                          {onEdit && (
                            <button
                              className="btn-edit"
                              onClick={() => onEdit(teacher)}
                              title="Editar professor"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(teacher.id, teacher.nome)}
                            title="Deletar professor"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-pagination"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <i className="fas fa-chevron-left"></i>
                Anterior
              </button>

              <span className="pagination-info">
                Página {currentPage + 1} de {totalPages}
              </span>

              <button
                className="btn-pagination"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                Próxima
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherList;
