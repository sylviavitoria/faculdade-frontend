import type { FormEvent, ChangeEvent } from 'react';

type FormValue = string | number | boolean | null;

interface GenericFormProps {
  formData: Record<string, FormValue>;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'password' | 'email' | 'textarea' | 'select';
    options?: Array<{ value: string | number; label: string }>;
    help?: string;
    rows?: number;
  }[];
  submitLabel: { idle: string; submitting: string };
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const GenericForm = ({
  formData,
  errors,
  isSubmitting,
  fields,
  submitLabel,
  onChange,
  onSubmit,
}: GenericFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>
            {field.label}: <span className="required">*</span>
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={String(formData[field.name] || '')}
              onChange={onChange}
              rows={field.rows || 5}
              className={errors[field.name] ? 'input-error' : ''}
              disabled={isSubmitting}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={String(formData[field.name] || '')}
              onChange={onChange}
              className={errors[field.name] ? 'input-error' : ''}
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              {field.options?.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={onChange}
              className={errors[field.name] ? 'input-error' : ''}
              disabled={isSubmitting}
            />
          )}

          {errors[field.name] && <div className="error-text">{errors[field.name]}</div>}

          {field.help && <div className="form-help">{field.help}</div>}
        </div>
      ))}

      <button type="submit" id="btn-cadastrar" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? submitLabel.submitting : submitLabel.idle}
      </button>
    </form>
  );
};

export default GenericForm;
