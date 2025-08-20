import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeacherForm from '../TeacherForm';

describe('TeacherForm', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn(e => e.preventDefault());

  const defaultProps = {
    formData: {
      nome: 'Prof. João',
      email: 'joao@exemplo.com',
      senha: '123456'
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
    render(<TeacherForm {...defaultProps} />);

    const nomeInput = screen.getByLabelText(/Nome:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const senhaInput = screen.getByLabelText(/Senha:/i);
    const submitButton = screen.getByRole('button', { name: /Cadastrar Professor/i });

    expect(nomeInput).toBeInTheDocument();
    expect(nomeInput).toHaveValue(defaultProps.formData.nome);

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue(defaultProps.formData.email);

    expect(senhaInput).toBeInTheDocument();
    expect(senhaInput).toHaveValue(defaultProps.formData.senha);

    expect(submitButton).toBeInTheDocument();
  });

  it('chama onChange quando os valores mudam', async () => {
    render(<TeacherForm {...defaultProps} />);

    const nomeInput = screen.getByLabelText(/Nome:/i);
    await userEvent.type(nomeInput, 'a');
    expect(mockOnChange).toHaveBeenCalled();

    const emailInput = screen.getByLabelText(/Email:/i);
    await userEvent.type(emailInput, 'a');
    expect(mockOnChange).toHaveBeenCalled();

    const senhaInput = screen.getByLabelText(/Senha:/i);
    await userEvent.type(senhaInput, 'a');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('chama onSubmit quando o formulário é enviado', () => {
    render(<TeacherForm {...defaultProps} />);

    const form = screen.getByRole('button', { name: /Cadastrar Professor/i }).closest('form')!;
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('mostra rótulo de envio correto quando não está enviando', () => {
    render(<TeacherForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /Cadastrar Professor/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it('mostra rótulo de envio correto quando está enviando', () => {
    render(<TeacherForm {...defaultProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: /Cadastrando.../i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('mostra mensagens de erro quando existirem', () => {
    const errors = {
      nome: 'Nome é obrigatório',
      email: 'Email inválido',
      senha: 'Senha inválida'
    };

    render(<TeacherForm {...defaultProps} errors={errors} />);

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
    expect(screen.getByText('Senha inválida')).toBeInTheDocument();
  });
});
