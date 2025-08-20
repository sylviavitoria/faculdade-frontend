import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenericForm from '../GenericForm';

describe('GenericForm', () => {
  const mockFormData = {
    nome: 'João Silva',
    email: 'joao@example.com',
    descricao: 'Descrição teste',
    tipo: 'tipo1'
  };
  
  const mockErrors = {
    nome: undefined,
    email: 'Email inválido',
    descricao: undefined,
    tipo: undefined
  };
  
  const mockFields = [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text' as const
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text' as const,
      help: 'Digite um email válido'
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea' as const,
      rows: 3
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select' as const,
      options: [
        { value: 'tipo1', label: 'Tipo 1' },
        { value: 'tipo2', label: 'Tipo 2' }
      ]
    }
  ];
  
  const mockSubmitLabel = { idle: 'Enviar', submitting: 'Enviando...' };
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn(e => e.preventDefault());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os tipos de campos corretamente', () => {
    render(
      <GenericForm
        formData={mockFormData}
        errors={mockErrors}
        isSubmitting={false}
        fields={mockFields}
        submitLabel={mockSubmitLabel}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const nomeInput = screen.getByLabelText(/Nome:/);
    expect(nomeInput).toBeInTheDocument();
    expect(nomeInput).toHaveValue(mockFormData.nome);
 
    const emailInput = screen.getByLabelText(/Email:/);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue(mockFormData.email);
    expect(emailInput).toHaveClass('input-error');
    expect(screen.getByText('Email inválido')).toBeInTheDocument();

    expect(screen.getByText('Digite um email válido')).toBeInTheDocument();
    
    const descricaoTextarea = screen.getByLabelText(/Descrição:/);
    expect(descricaoTextarea).toBeInTheDocument();
    expect(descricaoTextarea).toHaveValue(mockFormData.descricao);
    expect(descricaoTextarea.tagName).toBe('TEXTAREA');
    expect(descricaoTextarea).toHaveAttribute('rows', '3');
    
    const tipoSelect = screen.getByLabelText(/Tipo:/);
    expect(tipoSelect).toBeInTheDocument();
    expect(tipoSelect.tagName).toBe('SELECT');
    expect(screen.getAllByRole('option').length).toBe(3); 

    const submitButton = screen.getByRole('button', { name: 'Enviar' });
    expect(submitButton).toBeInTheDocument();
  });

  it('deve mostrar mensagens de erro quando existirem', () => {
    const customErrors = {
      ...mockErrors,
      nome: 'Nome é obrigatório'
    };

    render(
      <GenericForm
        formData={mockFormData}
        errors={customErrors}
        isSubmitting={false}
        fields={mockFields}
        submitLabel={mockSubmitLabel}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('deve aplicar classe de erro aos campos com erro', () => {
    render(
      <GenericForm
        formData={mockFormData}
        errors={mockErrors}
        isSubmitting={false}
        fields={mockFields}
        submitLabel={mockSubmitLabel}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const emailInput = screen.getByLabelText(/Email:/);
    expect(emailInput).toHaveClass('input-error');

    const nomeInput = screen.getByLabelText(/Nome:/);
    expect(nomeInput).not.toHaveClass('input-error');
  });

  it('deve desabilitar todos os campos quando enviando for true', () => {
    render(
      <GenericForm
        formData={mockFormData}
        errors={mockErrors}
        isSubmitting={true}
        fields={mockFields}
        submitLabel={mockSubmitLabel}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const nomeInput = screen.getByLabelText(/Nome:/);
    const emailInput = screen.getByLabelText(/Email:/);
    const descricaoTextarea = screen.getByLabelText(/Descrição:/);
    const tipoSelect = screen.getByLabelText(/Tipo:/);
    const submitButton = screen.getByRole('button');

    expect(nomeInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(descricaoTextarea).toBeDisabled();
    expect(tipoSelect).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('deve mostrar o texto de enviando no botão quando enviando for true', () => {
    render(
      <GenericForm
        formData={mockFormData}
        errors={mockErrors}
        isSubmitting={true}
        fields={mockFields}
        submitLabel={mockSubmitLabel}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Enviando...' });
    expect(submitButton).toBeInTheDocument();
  });

  it('deve chamar onChange quando um campo é alterado', async () => {
    render(
      <GenericForm
        formData={mockFormData}
        errors={mockErrors}
        isSubmitting={false}
        fields={mockFields}
        submitLabel={mockSubmitLabel}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const nomeInput = screen.getByLabelText(/Nome:/);
    await userEvent.type(nomeInput, 'a');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('deve renderizar o texto de ajuda quando fornecido', () => {
    render(
      <GenericForm
        formData={mockFormData}
        errors={mockErrors}
        isSubmitting={false}
        fields={mockFields}
        submitLabel={mockSubmitLabel}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Digite um email válido')).toBeInTheDocument();
  });

  it('deve renderizar as opções do select corretamente', () => {
    render(
      <GenericForm
        formData={mockFormData}
        errors={mockErrors}
        isSubmitting={false}
        fields={mockFields}
        submitLabel={mockSubmitLabel}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3); 
    expect(options[0]).toHaveValue('');
    expect(options[0]).toHaveTextContent('Select');
    expect(options[1]).toHaveValue('tipo1');
    expect(options[1]).toHaveTextContent('Tipo 1');
    expect(options[2]).toHaveValue('tipo2');
    expect(options[2]).toHaveTextContent('Tipo 2');
  });
});