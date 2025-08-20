import { useState, ChangeEvent, FormEvent } from 'react';
import { teacherService } from '../service/TeacherService';

interface TeacherFormData {
  nome: string;
  email: string;
  senha: string;
  id?: number;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
  form?: string;
}

const useTeacherForm = () => {
  const [formData, setFormData] = useState<TeacherFormData>({
    nome: '',
    email: '',
    senha: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de e-mail inválido';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 3) {
      newErrors.senha = 'A senha deve ter pelo menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (formData.id) {
        await teacherService.update(formData.id, formData);
      } else {
        await teacherService.create(formData);
      }
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ nome: '', email: '', senha: '' });
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar professor';
      setErrors({ form: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit
  };
};

export default useTeacherForm;
