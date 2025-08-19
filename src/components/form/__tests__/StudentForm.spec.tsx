import { render, screen, fireEvent } from '@testing-library/react';
import StudentForm from '../StudentForm';

describe('StudentForm', () => {
    const mockOnChange = jest.fn();
    const mockOnSubmit = jest.fn((e) => e.preventDefault());

    const defaultProps = {
        formData: {
            nome: '',
            email: '',
            matricula: '',
            senha: ''
        },
        errors: {},
        isSubmitting: false,
        onChange: mockOnChange,
        onSubmit: mockOnSubmit
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza todos os campos corretamente', () => {
        render(<StudentForm {...defaultProps} />);

        expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Matrícula/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    });

    it('chama onChange quando os valores mudam', () => {
        render(<StudentForm {...defaultProps} />);

        const nomeInput = screen.getByLabelText(/Nome/i);
        fireEvent.change(nomeInput, { target: { value: 'Alice' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('chama onSubmit quando o formulário é enviado', () => {
        render(<StudentForm {...defaultProps} />);

        const form = screen.getByRole('button', { name: /Estudante Criado/i }).closest('form')!;
        fireEvent.submit(form);

        expect(mockOnSubmit).toHaveBeenCalled();
    });


    it('mostra rótulo de envio correto quando não está enviando', () => {
        render(<StudentForm {...defaultProps} />);
        expect(screen.getByRole('button')).toHaveTextContent('Estudante Criado');
    });

    it('mostra rótulo de envio correto quando está enviando', () => {
        render(<StudentForm {...defaultProps} isSubmitting={true} />);
        expect(screen.getByRole('button')).toHaveTextContent('Criando...');
    });
});
