import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DisciplineForm from '../DisciplineForm';

describe('DisciplineForm', () => {
    const mockFormData = {
        nome: 'Algoritmos',
        codigo: 'ALG101',
        cargaHoraria: 60,
        professorId: 1
    };

    const mockErrors = {
        nome: undefined,
        codigo: 'Código já existe',
        cargaHoraria: undefined,
        professorId: undefined
    };

    const mockProfessors = [
        { id: 1, nome: 'Prof. João' },
        { id: 2, nome: 'Prof. Maria' }
    ];

    const mockOnChange = jest.fn();
    const mockOnSubmit = jest.fn(e => e.preventDefault());

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar todos os campos do formulário de disciplina', () => {
        render(
            <DisciplineForm
                formData={mockFormData}
                errors={{}}
                isSubmitting={false}
                onChange={mockOnChange}
                onSubmit={mockOnSubmit}
                professors={mockProfessors}
            />
        );

        expect(screen.getByLabelText(/Nome da Disciplina:/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Código:/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Professor Responsável:/)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Disciplina Criada' })).toBeInTheDocument();
    });

    it('deve renderizar as opções de professor corretamente', () => {
        render(
            <DisciplineForm
                formData={mockFormData}
                errors={{}}
                isSubmitting={false}
                onChange={mockOnChange}
                onSubmit={mockOnSubmit}
                professors={mockProfessors}
            />
        );

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(4); 
        expect(options[0]).toHaveTextContent('Select');
        expect(options[1]).toHaveTextContent('Selecione um professor');
        expect(options[2]).toHaveTextContent('Prof. João');
        expect(options[3]).toHaveTextContent('Prof. Maria');
    });

    it('deve exibir mensagens de erro quando existirem', () => {
        render(
            <DisciplineForm
                formData={mockFormData}
                errors={mockErrors}
                isSubmitting={false}
                onChange={mockOnChange}
                onSubmit={mockOnSubmit}
                professors={mockProfessors}
            />
        );

        expect(screen.getByText('Código já existe')).toBeInTheDocument();
    });

    it('deve chamar onChange ao alterar um campo', async () => {
        render(
            <DisciplineForm
                formData={mockFormData}
                errors={{}}
                isSubmitting={false}
                onChange={mockOnChange}
                onSubmit={mockOnSubmit}
                professors={mockProfessors}
            />
        );

        const nomeInput = screen.getByLabelText(/Nome da Disciplina:/);
        await userEvent.type(nomeInput, 'a');

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('deve chamar onSubmit ao enviar o formulário', async () => {
        render(
            <DisciplineForm
                formData={mockFormData}
                errors={{}}
                isSubmitting={false}
                onChange={mockOnChange}
                onSubmit={mockOnSubmit}
                professors={mockProfessors}
            />
        );

        const submitButton = screen.getByRole('button', { name: /Disciplina Criada/i });
        await userEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('deve desabilitar os campos e botão quando isSubmitting for true', () => {
        render(
            <DisciplineForm
                formData={mockFormData}
                errors={{}}
                isSubmitting={true}
                onChange={mockOnChange}
                onSubmit={mockOnSubmit}
                professors={mockProfessors}
            />
        );

        expect(screen.getByLabelText(/Nome da Disciplina:/)).toBeDisabled();
        expect(screen.getByLabelText(/Código:/)).toBeDisabled();
        expect(screen.getByLabelText(/Professor Responsável:/)).toBeDisabled();

        const button = screen.getByRole('button', { name: 'Criando...' });
        expect(button).toBeDisabled();
    });
});
