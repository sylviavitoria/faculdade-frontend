import { useEffect } from 'react';
import StudentForm from './form/StudentForm';
import useStudentForm from '../hooks/useStudentForm';
import CreateEntity from './generic/CreateEntity';
import { StudentResponse } from '../types/Student';
import './style/Forms.css';

interface CreateStudentProps {
  editingStudent?: StudentResponse | null;
  onStudentSaved?: () => void;
}

function CreateStudent({ editingStudent, onStudentSaved }: CreateStudentProps) {
  const { formData, errors, isSubmitting, isSubmitted, handleChange, handleSubmit, setFormData } = useStudentForm();

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        nome: editingStudent.nome,
        email: editingStudent.email,
        matricula: editingStudent.matricula,
        senha: '', 
        id: editingStudent.id
      });
    }
  }, [editingStudent, setFormData]);

  useEffect(() => {
    if (isSubmitted && onStudentSaved) {
      onStudentSaved();
    }
  }, [isSubmitted, onStudentSaved]);

  return (
    <div className="create-student">
      <CreateEntity
        title={editingStudent ? 'Editar Aluno' : 'Cadastrar Aluno'}
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        FormComponent={StudentForm}
      />
    </div>
  );
}

export default CreateStudent;
