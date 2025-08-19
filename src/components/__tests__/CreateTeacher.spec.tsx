import { render, screen } from '@testing-library/react';
import CreateTeacher from '../CreateTeacher';
import { TeacherResponse } from '../../types/Teacher';

const mockUseTeacherForm = {
  formData: { nome: '', email: '', senha: '', id: undefined },
  setFormData: jest.fn(),
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  handleChange: jest.fn(),
  handleSubmit: jest.fn()
};

jest.mock('../../hooks/useTeacherForm', () => ({
  __esModule: true,
  default: () => mockUseTeacherForm
}));

describe('CreateTeacher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTeacherForm.isSubmitted = false;
    mockUseTeacherForm.isSubmitting = false;
  });

  it('renderiza o título correto quando criando', () => {
    render(<CreateTeacher />);
    expect(screen.getByText(/Cadastrar Novo Professor/i)).toBeInTheDocument();
  });

  it('renderiza o título correto quando editando', () => {
    const teacher: TeacherResponse = { id: 1, nome: 'Prof. João', email: 'joao@mail.com' };
    render(<CreateTeacher editingTeacher={teacher} />);
    expect(screen.getByText(/Editar Professor/i)).toBeInTheDocument();
  });

  it('chama onTeacherSaved quando o formulário é submetido', () => {
    const onTeacherSaved = jest.fn();
    
    mockUseTeacherForm.isSubmitted = true;
    
    render(<CreateTeacher onTeacherSaved={onTeacherSaved} />);
    
    expect(onTeacherSaved).toHaveBeenCalled();
  });

  it('renderiza inputs do TeacherForm', () => {
    render(<CreateTeacher />);
    const inputNome = screen.getByLabelText(/Nome/i);
    const inputEmail = screen.getByLabelText(/Email/i);
    const inputSenha = screen.getByLabelText(/Senha/i);

    expect(inputNome).toBeInTheDocument();
    expect(inputEmail).toBeInTheDocument();
    expect(inputSenha).toBeInTheDocument();
  });
});
