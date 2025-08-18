import { useState, ChangeEvent, FormEvent } from 'react';
import { studentService } from '../service/StudentService';

interface StudentFormData {
  nome: string;
  email: string;
  matricula: string;
  senha: string;
  id?: number;
}

interface FormErrors {
  nome?: string;
  email?: string;
  matricula?: string;
  senha?: string;
  form?: string;
}

const useStudentForm = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    nome: '',
    email: '',
    matricula: '',
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

    if (!formData.matricula.trim()) {
      newErrors.matricula = 'Número de matrícula é obrigatório';
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
      let result;
      if (formData.id) {
        result = await studentService.update(formData.id, formData);
        console.log('Aluno atualizado com sucesso:', result);
      } else {
        result = await studentService.create(formData);
        console.log('Aluno criado com sucesso:', result);
      }
      
      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({
          nome: '',
          email: '',
          matricula: '',
          senha: ''
        });
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      setErrors({
        form: error instanceof Error
          ? error.message
          : 'Erro ao salvar aluno. Por favor, tente novamente.'
      });
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

export default useStudentForm;
