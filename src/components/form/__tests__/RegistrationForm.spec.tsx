import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from '../RegistrationForm';

describe('RegistrationForm', () => {
    const mockOnChange = jest.fn();
    const mockOnSubmit = jest.fn(e => e.preventDefault());

    const students = [
        { id: 1, nome: 'Aluno 1', matricula: 'MAT001' },
        { id: 2, nome: 'Aluno 2', matricula: 'MAT002' }
    ];

    const disciplines = [
        { id: 1, nome: 'Matemática', cargaHoraria: 60 },
        { id: 2, nome: 'Português', cargaHoraria: 40 }
    ];

    const defaultProps = {
        formData: { alunoId: '', disciplinaId: '' },
        errors: {},
        isSubmitting: false,
        loadingOptions: false,
        students,
        disciplines,
        onChange: mockOnChange,
        onSubmit: mockOnSubmit
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza todos os campos corretamente', () => {
        render(<RegistrationForm {...defaultProps} />);

        const alunoSelect = screen.getByLabelText(/Aluno:/i);
        const disciplinaSelect = screen.getByLabelText(/Disciplina:/i);

        const alunoOptions = Array.from(alunoSelect.options);
        expect(alunoOptions.map(o => o.text)).toEqual([
            'Select',             
            'Selecione um aluno',
            'Aluno 1 - MAT001',
            'Aluno 2 - MAT002'
        ]);

        const disciplinaOptions = Array.from(disciplinaSelect.options);
        expect(disciplinaOptions.map(o => o.text)).toEqual([
            'Select',             
            'Selecione uma disciplina',
            'Matemática (60h)',
            'Português (40h)'
        ]);
    });

    it('mostra loading quando loadingOptions é true', () => {
        render(<RegistrationForm {...defaultProps} loadingOptions={true} />);
        expect(screen.getByText(/Carregando dados.../i)).toBeInTheDocument();
        expect(screen.getByText(/Carregando dados.../i).previousSibling).toHaveClass('loading-spinner');
    });

    it('chama onChange quando um select é alterado', async () => {
        render(<RegistrationForm {...defaultProps} />);
        const alunoSelect = screen.getByLabelText(/Aluno:/i);
        const disciplinaSelect = screen.getByLabelText(/Disciplina:/i);

        await userEvent.selectOptions(alunoSelect, '1');
        await userEvent.selectOptions(disciplinaSelect, '2');

        expect(mockOnChange).toHaveBeenCalledTimes(2);
    });

    it('chama onSubmit ao enviar o formulário', () => {
        render(<RegistrationForm {...defaultProps} />);
        const form = screen.getByRole('button', { name: /Matrícula Criada/i }).closest('form')!;
        fireEvent.submit(form);
        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('mostra mensagens de erro quando existirem', () => {
        const errors = { alunoId: 'Aluno obrigatório', disciplinaId: 'Disciplina obrigatória' };
        render(<RegistrationForm {...defaultProps} errors={errors} />);
        expect(screen.getByText('Aluno obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Disciplina obrigatória')).toBeInTheDocument();
    });

    it('desabilita campos e botão quando isSubmitting for true', () => {
        render(<RegistrationForm {...defaultProps} isSubmitting={true} />);

        const alunoSelect = screen.getByLabelText(/Aluno:/i);
        const disciplinaSelect = screen.getByLabelText(/Disciplina:/i);
        const submitButton = screen.getByRole('button', { name: /Criando.../i });

        expect(alunoSelect).toBeDisabled();
        expect(disciplinaSelect).toBeDisabled();
        expect(submitButton).toBeDisabled();
    });

    it('mostra o texto correto no botão quando isSubmitting for true', () => {
        render(<RegistrationForm {...defaultProps} isSubmitting={true} submitLabel={{ idle: 'Matrícula Criada', submitting: 'Criando...' }} />);
        const submitButton = screen.getByRole('button', { name: /Criando.../i });
        expect(submitButton).toBeInTheDocument();
    });
});
