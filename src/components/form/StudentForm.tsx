import type { FormEvent } from 'react';
import GenericForm from './GenericForm';

interface FormErrors {
  nome?: string;
  email?: string;
  matricula?: string;
  senha?: string;
  form?: string;
}

interface StudentFormProps {
  formData: {
    nome: string;
    email: string;
    matricula: string;
    senha: string;
    id?: number;
  };
  errors: FormErrors;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel?: { idle: string; submitting: string };
}

const StudentForm = ({
  formData,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
  submitLabel = { idle: 'Estudante Criado', submitting: 'Criando...' }
}: StudentFormProps) => {
  const fields = [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text' as const
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const
    },
    {
      name: 'matricula',
      label: 'Matrícula',
      type: 'text' as const
    },
    {
      name: 'senha',
      label: 'Senha',
      type: 'password' as const
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

export default StudentForm;
