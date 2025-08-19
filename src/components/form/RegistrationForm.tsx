import type { FormEvent } from 'react';
import GenericForm from './GenericForm';
import { StudentResponse } from '../../types/Student';
import { DisciplineResponse } from '../../types/Discipline';

interface FormErrors {
  alunoId?: string;
  disciplinaId?: string;
  form?: string;
}

interface RegistrationFormProps {
  formData: {
    alunoId: number | '';
    disciplinaId: number | '';
    id?: number;
  };
  errors: FormErrors;
  isSubmitting: boolean;
  loadingOptions: boolean;
  students: StudentResponse[];
  disciplines: DisciplineResponse[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel?: { idle: string; submitting: string };
}

const RegistrationForm = ({
  formData,
  errors,
  isSubmitting,
  loadingOptions,
  students,
  disciplines,
  onChange,
  onSubmit,
  submitLabel = { idle: 'Matrícula Criada', submitting: 'Criando...' }
}: RegistrationFormProps) => {
  if (loadingOptions) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  const fields = [
    {
      name: 'alunoId',
      label: 'Aluno',
      type: 'select' as const,
      options: [
        { value: '', label: 'Selecione um aluno' },
        ...students.map(student => ({
          value: student.id,
          label: `${student.nome} - ${student.matricula}`
        }))
      ]
    },
    {
      name: 'disciplinaId',
      label: 'Disciplina',
      type: 'select' as const,
      options: [
        { value: '', label: 'Selecione uma disciplina' },
        ...disciplines.map(discipline => ({
          value: discipline.id,
          label: `${discipline.nome} (${discipline.cargaHoraria}h)`
        }))
      ]
    }
  ];

  return (
    <GenericForm
      formData={formData}
      errors={errors}
      isSubmitting={isSubmitting}
      fields={fields}
      submitLabel={submitLabel}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default RegistrationForm;
