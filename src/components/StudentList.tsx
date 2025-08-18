import { useState, useEffect } from 'react';
import { studentService } from '../service/StudentService';
import { StudentResponse, PageResponse } from '../types/Student';
import './style/Tables.css';

interface StudentListProps {
  onEdit?: (student: StudentResponse) => void;
  refreshTrigger?: number;
}

const StudentList = ({ onEdit, refreshTrigger }: StudentListProps) => {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const loadStudents = async (page = 0) => {
    setLoading(true);
    setError('');

    try {
      const response: PageResponse<StudentResponse> = await studentService.list(page, pageSize);
      setStudents(response.content);
      setCurrentPage(response.pageable.pageNumber);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [refreshTrigger]);

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja deletar o aluno ${nome}?`)) {
      return;
    }

    try {
      await studentService.delete(id);
      loadStudents(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar aluno');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadStudents(newPage);
    }
  };

  if (loading) {
    return <div className="loading">Carregando alunos...</div>;
  }

  return (
    <div className="student-list">
      <div className="list-header">
        <h3>Lista de Alunos</h3>
        <p>Total: {totalElements} alunos cadastrados</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum aluno cadastrado ainda.</p>
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
                  <th>Matrícula</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.nome}</td>
                    <td>{student.email}</td>
                    <td>{student.matricula}</td>
                    <td>
                      <div className="action-buttons">
                        {onEdit && (
                          <button
                            className="btn-edit"
                            onClick={() => onEdit(student)}
                            title="Editar aluno"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(student.id, student.nome)}
                          title="Deletar aluno"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
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

export default StudentList;
