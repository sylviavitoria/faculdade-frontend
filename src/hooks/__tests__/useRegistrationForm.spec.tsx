import { renderHook, act } from '@testing-library/react';
import { ChangeEvent, FormEvent } from 'react';
import useRegistrationForm from '../useRegistrationForm';
import { registrationService } from '../../service/RegistrationService';
import { studentService } from '../../service/StudentService';
import { disciplineService } from '../../service/DisciplineService';
import { StudentResponse } from '../../types/Student';
import { DisciplineResponse } from '../../types/Discipline';

jest.mock('../../service/RegistrationService');
jest.mock('../../service/StudentService');
jest.mock('../../service/DisciplineService');

const mockRegistrationService = registrationService as jest.Mocked<typeof registrationService>;
const mockStudentService = studentService as jest.Mocked<typeof studentService>;
const mockDisciplineService = disciplineService as jest.Mocked<typeof disciplineService>;

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('useRegistrationForm', () => {
  const mockStudents: StudentResponse[] = [{ id: 1, nome: 'Aluno 1' }];
  const mockDisciplines: DisciplineResponse[] = [{ id: 1, nome: 'Disciplina 1', codigo: 'D1', cargaHoraria: 60, professorId: 1 }];

  beforeEach(() => {
    jest.clearAllMocks();
    mockStudentService.list.mockResolvedValue({ content: mockStudents, totalPages: 1, totalElements: 1, pageable: {}, last: true, first: true, size: 1, sort: {}, numberOfElements: 1, empty: false });
    mockDisciplineService.list.mockResolvedValue({ content: mockDisciplines, totalPages: 1, totalElements: 1, pageable: {}, last: true, first: true, size: 1, sort: {}, numberOfElements: 1, empty: false });
  });

  it('carrega alunos e disciplinas automaticamente', async () => {
    const { result } = renderHook(() => useRegistrationForm());

    await act(async () => {
      await result.current.loadOptions();
    });

    expect(result.current.students).toEqual(mockStudents);
    expect(result.current.disciplines).toEqual(mockDisciplines);
    expect(result.current.errors.form).toBeUndefined();
  });

  it('handleChange atualiza formData e reseta erros', () => {
    const { result } = renderHook(() => useRegistrationForm());

    const event = {
      target: { name: 'alunoId', value: '1' }
    } as ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.formData.alunoId).toBe(1);
  });

  it('valida formulário e define erros', () => {
    const { result } = renderHook(() => useRegistrationForm());

    const event = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
    act(() => {
      result.current.handleSubmit(event);
    });

    expect(result.current.errors.alunoId).toBe('Seleção do aluno é obrigatória');
    expect(result.current.errors.disciplinaId).toBe('Seleção da disciplina é obrigatória');
  });

  it('submete formulário com sucesso', async () => {
    mockRegistrationService.create.mockResolvedValue(undefined);
    const { result } = renderHook(() => useRegistrationForm());

    act(() => {
      result.current.setFormData({ alunoId: 1, disciplinaId: 1 });
    });

    const event = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(mockRegistrationService.create).toHaveBeenCalledWith({ alunoId: 1, disciplinaId: 1 });
    expect(result.current.isSubmitted).toBe(true);
    expect(result.current.formData.alunoId).toBe('');
    expect(result.current.formData.disciplinaId).toBe('');
  });

  it('define erro ao submeter formulário com falha', async () => {
    mockRegistrationService.create.mockRejectedValueOnce(new Error('Erro teste'));
    const { result } = renderHook(() => useRegistrationForm());

    act(() => {
      result.current.setFormData({ alunoId: 1, disciplinaId: 1 });
    });

    const event = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.errors.form).toBe('Erro teste');
  });
});
