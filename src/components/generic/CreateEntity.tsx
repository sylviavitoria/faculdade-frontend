import { FormEvent, ChangeEvent, ComponentType } from 'react';

interface FormProps<T extends Record<string, unknown>> {
  formData: T;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel: { idle: string; submitting: string };
  [key: string]: unknown;
}

interface CreateEntityProps<T extends Record<string, unknown>> {
  title: string;
  formData: T;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  FormComponent: ComponentType<FormProps<T>>;
  formProps?: Omit<FormProps<T>, 'formData' | 'errors' | 'isSubmitting' | 'onChange' | 'onSubmit' | 'submitLabel'>;
}

function CreateEntity<T extends Record<string, unknown>>({
  title,
  formData,
  errors,
  isSubmitting,
  isSubmitted,
  handleChange,
  handleSubmit,
  FormComponent,
  formProps = {}
}: CreateEntityProps<T>) {
  return (
    <div className="create-entity">
      <h1>{title}</h1>
      
      {isSubmitted && (
        <div className="success-message">
          Cadastro realizado com sucesso!
        </div>
      )}

      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      <FormComponent 
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel={{ idle: 'Cadastrar', submitting: 'Cadastrando...' }}
        {...formProps}
      />
    </div>
  );
}

export default CreateEntity;
