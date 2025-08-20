import { render, screen, fireEvent } from '@testing-library/react';
import Registration from '../Registration';
import { useAuth } from '../../hooks/useAuth';
import useRegistrationForm from '../../hooks/useRegistrationForm';
import React from 'react';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useRegistrationForm');

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseRegistrationForm = useRegistrationForm as jest.MockedFunction<typeof useRegistrationForm>;

describe('Registration Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseRegistrationForm.mockReturnValue({
            formData: {},
            errors: {},
            isSubmitting: false,
            isSubmitted: false,
            loadingOptions: false,
            students: [],
            disciplines: [],
            handleChange: jest.fn(),
            handleSubmit: jest.fn()
        });
    });

    it('renderiza com mensagens corretas para ROLE_ADMIN', () => {
        mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ADMIN', name: 'Admin' } });

        render(<Registration />);

        expect(screen.getByText('Gerenciamento de Matrículas')).toBeInTheDocument();
        expect(screen.getByText('Administre matrículas: crie, visualize, atualize notas e exclua')).toBeInTheDocument();

        expect(screen.getByText('Lista de Matrículas')).toBeInTheDocument();
        expect(screen.getByText('Nova Matrícula')).toBeInTheDocument();
        expect(screen.getByText('Buscar por ID')).toBeInTheDocument();
    });

    it('ROLE_ALUNO não vê tab de lista e vê mensagem do header', () => {
        mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ALUNO', name: 'Aluno' } });

        render(<Registration />);

        expect(screen.getByText('Consulte suas matrículas por ID')).toBeInTheDocument();

        expect(screen.queryByText('Lista de Matrículas')).not.toBeInTheDocument();

        expect(screen.getByText('Buscar por ID')).toHaveClass('active');
    });

    it('alterna entre tabs corretamente', () => {
        mockedUseAuth.mockReturnValue({ user: { role: 'ROLE_ADMIN', name: 'Admin' } });
        render(<Registration />);

        const listTab = screen.getByText('Lista de Matrículas');
        const createTab = screen.getByText('Nova Matrícula');
        const searchTab = screen.getByText('Buscar por ID');

        expect(listTab).toHaveClass('active');

        fireEvent.click(createTab);
        expect(createTab).toHaveClass('active');

        fireEvent.click(searchTab);
        expect(searchTab).toHaveClass('active');
    });
});
