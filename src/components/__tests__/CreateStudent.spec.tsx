import { render, screen } from '@testing-library/react';
import CreateStudent from '../CreateStudent';
import useStudentForm from '../../hooks/useStudentForm';
import { StudentResponse } from '../../types/Student';
import React from 'react';

jest.mock('../../hooks/useStudentForm');

describe('CreateStudent', () => {
    const mockHandleChange = jest.fn();
    const mockHandleSubmit = jest.fn();
    const mockSetFormData = jest.fn();

    const defaultHookReturn = {
        formData: { nome: '', email: '', matricula: '', senha: '', id: undefined },
        errors: {},
        isSubmitting: false,
        isSubmitted: false,
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        setFormData: mockSetFormData
    };

    beforeEach(() => {
        (useStudentForm as jest.Mock).mockReturnValue(defaultHookReturn);
        jest.clearAllMocks();
    });

    it('renderiza o título correto quando criando', () => {
        render(<CreateStudent />);
        expect(screen.getByText('Cadastrar Aluno')).toBeInTheDocument();
    });

    it('renderiza o título correto quando editando', () => {
        const student: StudentResponse = {
            id: 1,
            nome: 'João',
            email: 'joao@email.com',
            matricula: 'MAT001'
        };
        render(<CreateStudent editingStudent={student} />);
        expect(mockSetFormData).toHaveBeenCalledWith({
            nome: student.nome,
            email: student.email,
            matricula: student.matricula,
            senha: '',
            id: student.id
        });
        expect(screen.getByText('Editar Aluno')).toBeInTheDocument();
    });

    it('chama onStudentSaved quando o formulário é submetido', () => {
        const onStudentSaved = jest.fn();
        (useStudentForm as jest.Mock).mockReturnValue({
            ...defaultHookReturn,
            isSubmitted: true
        });
        render(<CreateStudent onStudentSaved={onStudentSaved} />);
        expect(onStudentSaved).toHaveBeenCalled();
    });

    it('passa corretamente props e callbacks para StudentForm via CreateEntity', () => {
        render(<CreateStudent />);

        const inputNome = screen.getByLabelText(/Nome/i);
        const inputEmail = screen.getByLabelText(/Email/i);
        const inputMatricula = screen.getByLabelText(/Matrícula/i);
        const inputSenha = screen.getByLabelText(/Senha/i);

        expect(inputNome).toBeInTheDocument();
        expect(inputEmail).toBeInTheDocument();
        expect(inputMatricula).toBeInTheDocument();
        expect(inputSenha).toBeInTheDocument();

    });
});
