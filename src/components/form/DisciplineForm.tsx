import type { FormEvent } from 'react';
import GenericForm from './GenericForm';

interface FormErrors {
  nome?: string;
  codigo?: string;
  professorId?: string;
  form?: string;
}

interface DisciplineFormProps {
  formData: {
    nome: string;
    codigo: string;
    professorId?: number;
    id?: number;
  };
  errors: FormErrors;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel?: { idle: string; submitting: string };
  professors?: Array<{ id: number; nome: string }>;
}

const DisciplineForm = ({
  formData,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
  submitLabel = { idle: 'Disciplina Criada', submitting: 'Criando...' },
  professors = []
}: DisciplineFormProps) => {
  const fields = [
    {
      name: 'nome',
      label: 'Nome da Disciplina',
      type: 'text' as const
    },
    {
      name: 'codigo',
      label: 'Código',
      type: 'text' as const,
      help: 'Código único da disciplina (ex: ALG101)'
    },
    {
      name: 'professorId',
      label: 'Professor Responsável',
      type: 'select' as const,
      options: [
        { value: '', label: 'Selecione um professor (opcional)' },
        ...professors.map(prof => ({ 
          value: prof.id, 
          label: prof.nome 
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

export default DisciplineForm;
