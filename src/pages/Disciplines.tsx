import React, { useState, useEffect } from 'react';
import { disciplineService } from '../service/DisciplineService';
import { teacherService } from '../service/TeacherService';
import { DisciplineResponse } from '../types/Discipline';
import { TeacherResponse } from '../types/Teacher';
import useDisciplineForm from '../hooks/useDisciplineForm';
import CreateEntity from '../components/generic/CreateEntity';
import DisciplineForm from '../components/form/DisciplineForm';
import DisciplineSearchById from '../components/DisciplineSearchById';
import RoleBasedAccess from '../components/RoleBasedAccess';
import './Student.css';


interface DisciplineListProps {
  disciplines: DisciplineResponse[];
  currentPage: number;
  totalPages: number;
  onEdit: (discipline: DisciplineResponse) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

const DisciplineList: React.FC<DisciplineListProps> = ({
  disciplines,
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onPageChange
}) => {
  return (
    <div className="list-section">
      <h2>Lista de Disciplinas</h2>
      {disciplines.length === 0 ? (
        <p>Nenhuma disciplina encontrada.</p>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Professor</th>
                  <RoleBasedAccess allowedRoles={['ROLE_ADMIN']}>
                    <th>Ações</th>
                  </RoleBasedAccess>
                </tr>
              </thead>
              <tbody>
                {disciplines.map((discipline) => (
                  <tr key={discipline.id}>
                    <td>{discipline.nome}</td>
                    <td>{discipline.codigo}</td>
                    <td>{discipline.professor?.nome || 'Não atribuído'}</td>
                    <RoleBasedAccess allowedRoles={['ROLE_ADMIN']}>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => onEdit(discipline)}
                            className="btn btn-edit"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => onDelete(discipline.id)}
                            className="btn btn-delete"
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </RoleBasedAccess>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="btn btn-secondary"
              >
                Anterior
              </button>
              <span className="page-info">
                Página {currentPage + 1} de {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="btn btn-secondary"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Disciplines: React.FC = () => {
  const [disciplines, setDisciplines] = useState<DisciplineResponse[]>([]);
  const [professors, setProfessors] = useState<TeacherResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'search'>('list');
  const [editingDiscipline, setEditingDiscipline] = useState<DisciplineResponse | null>(null);

  const {
    formData,
    setFormData,
    errors,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit
  } = useDisciplineForm();

  const loadDisciplines = async (page: number = 0) => {
    try {
      const response = await disciplineService.list(page, 10);
      setDisciplines(response.content);
      setCurrentPage(response.pageable.pageNumber);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  };

  const loadProfessors = async () => {
    try {
      const response = await teacherService.list(0, 100);
      setProfessors(response.content);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

  useEffect(() => {
    loadDisciplines();
    loadProfessors();
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      loadDisciplines(currentPage);
      setEditingDiscipline(null);
      setActiveTab('list');
    }
  }, [isSubmitted, currentPage]);

  const handleEdit = (discipline: DisciplineResponse) => {
    console.log('Editando disciplina:', discipline);
    setEditingDiscipline(discipline);
    setFormData({
      id: discipline.id,
      nome: discipline.nome,
      codigo: discipline.codigo,
      professorId: discipline.professor?.id
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: number) => {
    if (!id) {
      console.error('ID da disciplina é obrigatório para excluir');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      try {
        console.log('Excluindo disciplina com ID:', id);
        await disciplineService.delete(id);
        await loadDisciplines(currentPage);
      } catch (error) {
        console.error('Erro ao excluir disciplina:', error);
        alert('Erro ao excluir disciplina');
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    loadDisciplines(newPage);
  };

  const handleTabChange = (tab: 'list' | 'create' | 'search') => {
    setActiveTab(tab);
    if (tab === 'create' && !editingDiscipline) {
      setFormData({ nome: '', codigo: '', professorId: undefined });
    }
    if (tab !== 'create') {
      setEditingDiscipline(null);
    }
  };

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>Gerenciamento de Disciplinas</h1>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => handleTabChange('list')}
        >
          Lista de Disciplinas
        </button>
        <RoleBasedAccess allowedRoles={['ROLE_ADMIN']}>
          <button
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => handleTabChange('create')}
          >
            {editingDiscipline ? 'Editar Disciplina' : 'Cadastrar Disciplina'}
          </button>
        </RoleBasedAccess>
        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => handleTabChange('search')}
        >
          Buscar por ID
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'list' && (
          <DisciplineList
            disciplines={disciplines}
            currentPage={currentPage}
            totalPages={totalPages}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
          />
        )}

        {activeTab === 'create' && (
          <RoleBasedAccess
            allowedRoles={['ROLE_ADMIN']}
            fallback={<p>Você não tem permissão para criar/editar disciplinas.</p>}
          >
            <CreateEntity
              title={editingDiscipline ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina'}
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              FormComponent={DisciplineForm}
              formProps={{ 
                professors: professors.map(p => ({ id: p.id, nome: p.nome })),
                submitLabel: editingDiscipline 
                  ? { idle: 'Atualizar Disciplina', submitting: 'Atualizando...' }
                  : { idle: 'Cadastrar Disciplina', submitting: 'Cadastrando...' }
              }}
            />
          </RoleBasedAccess>
        )}

        {activeTab === 'search' && (
          <DisciplineSearchById />
        )}
      </div>
    </div>
  );
};

export default Disciplines;
