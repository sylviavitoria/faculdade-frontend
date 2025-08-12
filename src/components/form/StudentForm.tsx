import type { FormEvent } from 'react';
import GenericForm from './GenericForm';

interface FormErrors {
  name?: string;
  email?: string;
  registrationNumber?: string;
  password?: string;
  form?: string;
}

interface StudentFormProps {
  formData: {
    name: string;
    email: string;
    registrationNumber: string;
    password: string;
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
      name: 'name',
      label: 'Nome',
      type: 'text' as const
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text' as const
    },
    {
      name: 'registrationNumber',
      label: 'Número de Registro',
      type: 'text' as const
    },
    {
      name: 'password',
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
