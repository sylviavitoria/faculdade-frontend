import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { registrationService } from '../service/RegistrationService';
import { studentService } from '../service/StudentService';
import { disciplineService } from '../service/DisciplineService';
import { Registration } from '../types/Registration';
import { StudentResponse } from '../types/Student';
import { DisciplineResponse } from '../types/Discipline';

interface RegistrationFormData {
  alunoId: number | '';
  disciplinaId: number | '';
  id?: number;
}

interface FormErrors {
  alunoId?: string;
  disciplinaId?: string;
  form?: string;
}

const useRegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    alunoId: '',
    disciplinaId: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineResponse[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const [studentsResponse, disciplinesResponse] = await Promise.all([
        studentService.list(0, 1000),
        disciplineService.list(0, 1000) 
      ]);
      setStudents(studentsResponse.content);
      setDisciplines(disciplinesResponse.content);
      
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
      setErrors({ form: 'Erro ao carregar dados necessários' });
    } finally {
      setLoadingOptions(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.alunoId) {
      newErrors.alunoId = 'Seleção do aluno é obrigatória';
    }

    if (!formData.disciplinaId) {
      newErrors.disciplinaId = 'Seleção da disciplina é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
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
      const registrationData: Registration = {
        alunoId: formData.alunoId as number,
        disciplinaId: formData.disciplinaId as number
      };

      await registrationService.create(registrationData);
      
      setIsSubmitted(true);
      setFormData({
        alunoId: '',
        disciplinaId: ''
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar matrícula';
      setErrors({ form: errorMessage });
      console.error('Erro ao criar matrícula:', error);
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
    students,
    disciplines,
    loadingOptions,
    handleChange,
    handleSubmit,
    loadOptions
  };
};

export default useRegistrationForm;
