import { renderHook, act } from '@testing-library/react';
import { useProfile } from '../useProfile';
import { studentService } from '../../service/StudentService';
import { teacherService } from '../../service/TeacherService';
import { useAuth } from '../useAuth';

jest.mock('../../service/StudentService');
jest.mock('../../service/TeacherService');
jest.mock('../useAuth');

const mockStudentService = studentService as jest.Mocked<typeof studentService>;
const mockTeacherService = teacherService as jest.Mocked<typeof teacherService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('define erro quando não há usuário', async () => {
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.loadProfile();
    });

    expect(result.current.error).toBe('Usuário não autenticado');
    expect(result.current.profileData).toBeNull();
  });

  it('carrega perfil de aluno', async () => {
    mockUseAuth.mockReturnValue({ user: { role: 'ROLE_ALUNO' } });
    mockStudentService.getMe.mockResolvedValue({ id: 1, nome: 'Aluno Teste' });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.loadProfile();
    });

    expect(result.current.profileData).toEqual({ id: 1, nome: 'Aluno Teste' });
    expect(result.current.error).toBeNull();
  });

  it('carrega perfil de professor', async () => {
    mockUseAuth.mockReturnValue({ user: { role: 'ROLE_PROFESSOR' } });
    mockTeacherService.getMe.mockResolvedValue({ id: 1, nome: 'Professor Teste' });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.loadProfile();
    });

    expect(result.current.profileData).toEqual({ id: 1, nome: 'Professor Teste' });
    expect(result.current.error).toBeNull();
  });

  it('define erro quando tipo de usuário não suportado', async () => {
    mockUseAuth.mockReturnValue({ user: { role: 'ROLE_ADMIN' } });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.loadProfile();
    });

    expect(result.current.error).toBe('Tipo de usuário não suportado para perfil');
    expect(result.current.profileData).toBeNull();
  });

  it('clearError reseta o erro', async () => {
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.loadProfile();
    });

    expect(result.current.error).toBe('Usuário não autenticado');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
