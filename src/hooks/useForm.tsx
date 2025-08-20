import { useState, FormEvent, ChangeEvent } from 'react';

type FieldValue = string | number | boolean | null;
type FormData = Record<string, FieldValue>;

interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: FieldValue, formData?: FormData) => boolean;
  message: string;
}

type ValidationRules = Record<string, ValidationRule[]>;

interface UseFormProps<T extends FormData> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (data: T) => void;
  resetAfterSubmit?: boolean;
  successTimeout?: number;
}

export default function useForm<T extends FormData>({
  initialValues,
  validationRules = {},
  onSubmit,
  resetAfterSubmit = true,
  successTimeout = 3000
}: UseFormProps<T>) {
  const [formData, setFormData] = useState<T>({ ...initialValues });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: FieldValue = value;
    
    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    } as T);

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateField = (name: string, value: FieldValue): string | undefined => {
    if (!validationRules[name]) return undefined;

    for (const rule of validationRules[name]) {

      if (rule.required && (value === '' || value === null || value === undefined)) {
        return rule.message;
      }
      
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        return rule.message;
      }
      
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        return rule.message;
      }
      
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        return rule.message;
      }
      
      if (rule.custom && !rule.custom(value, formData)) {
        return rule.message;
      }
    }
    
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach((fieldName) => {
      const errorMessage = validateField(fieldName, formData[fieldName]);
      if (errorMessage) {
        newErrors[fieldName] = errorMessage;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setEnviando(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      setEnviado(true);
      
      if (resetAfterSubmit) {
        setTimeout(() => {
          setEnviado(false);
          setFormData({ ...initialValues });
        }, successTimeout);
      }
    } catch (error) {
      setErrors({
        ...errors,
        form: error instanceof Error ? error.message : 'Erro ao processar o formulário'
      });
    } finally {
      setEnviando(false);
    }
  };

  const resetForm = () => {
    setFormData({ ...initialValues });
    setErrors({});
    setEnviado(false);
  };

  return { 
    formData, 
    setFormData,
    errors, 
    enviando, 
    enviado, 
    handleChange, 
    handleSubmit,
    resetForm
  };
}