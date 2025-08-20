import { useEffect } from 'react';
import CreateEntity from './generic/CreateEntity';
import TeacherForm from './form/TeacherForm';
import useTeacherForm from '../hooks/useTeacherForm';
import { TeacherResponse } from '../types/Teacher';

interface CreateTeacherProps {
  editingTeacher?: TeacherResponse | null;
  onTeacherSaved?: () => void;
}

const CreateTeacher = ({ editingTeacher, onTeacherSaved }: CreateTeacherProps) => {
  const {
    formData,
    setFormData,
    errors,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit
  } = useTeacherForm();

  useEffect(() => {
    if (editingTeacher) {
      setFormData({
        nome: editingTeacher.nome,
        email: editingTeacher.email,
        senha: '',
        id: editingTeacher.id
      });
    } else {
      setFormData({ nome: '', email: '', senha: '' });
    }
  }, [editingTeacher, setFormData]);

  useEffect(() => {
    if (isSubmitted && onTeacherSaved) {
      onTeacherSaved();
    }
  }, [isSubmitted, onTeacherSaved]);

  return (
    <CreateEntity
      title={editingTeacher ? 'Editar Professor' : 'Cadastrar Novo Professor'}
      formData={formData}
      errors={errors}
      isSubmitting={isSubmitting}
      isSubmitted={isSubmitted}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      FormComponent={TeacherForm}
      formProps={{
        submitLabel: {
          idle: editingTeacher ? 'Atualizar Professor' : 'Cadastrar Professor',
          submitting: editingTeacher ? 'Atualizando...' : 'Cadastrando...'
        }
      }}
    />
  );
};

export default CreateTeacher;
