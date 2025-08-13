import { useState, ChangeEvent, FormEvent } from 'react';
// import { studentService } from '../service/StudentService';

interface StudentFormData {
  name: string;
  email: string;
  registrationNumber: string;
  password: string;
  id?: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  registrationNumber?: string;
  password?: string;
  form?: string;
}

const useStudentForm = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    registrationNumber: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de e-mail inválido';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Número de matrícula é obrigatório';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Aluno criado com sucesso:', formData);
      
      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          registrationNumber: '',
          password: ''
        });
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      setErrors({
        form: error instanceof Error
          ? error.message
          : 'Erro ao criar aluno. Por favor, tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit
  };
};

export default useStudentForm;
