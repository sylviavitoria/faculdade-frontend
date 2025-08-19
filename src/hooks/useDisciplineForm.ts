import { useState, ChangeEvent, FormEvent } from 'react';
import { disciplineService } from '../service/DisciplineService';

interface DisciplineFormData {
  nome: string;
  codigo: string;
  professorId?: number;
  id?: number;
}

interface FormErrors {
  nome?: string;
  codigo?: string;
  professorId?: string;
  form?: string;
}

const useDisciplineForm = () => {
  const [formData, setFormData] = useState<DisciplineFormData>({
    nome: '',
    codigo: '',
    professorId: undefined
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'professorId' ? (value ? Number(value) : undefined) : value
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
      let result;
      
      if (formData.id) {
        console.log('Atualizando disciplina com ID:', formData.id);
        result = await disciplineService.update(formData.id, formData);
        console.log('Resultado da atualização:', result);
      } else {
        console.log('Criando nova disciplina:', formData);
        result = await disciplineService.create(formData);
        console.log('Resultado da criação:', result);
      }

      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          nome: '',
          codigo: '',
          professorId: undefined
        });
      }, 3000);

    } catch (error) {
      console.error('Erro no envio do formulário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar disciplina';
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

export default useDisciplineForm;
