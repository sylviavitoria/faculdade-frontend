import { renderHook, act } from '@testing-library/react';
import { useDisciplines } from '../useDisciplines';
import { disciplineService } from '../../service/DisciplineService';
import { DisciplineResponse, PageResponse } from '../../types/Discipline';

jest.mock('../../service/DisciplineService');

const mockDisciplineService = disciplineService as jest.Mocked<typeof disciplineService>;

const mockPageResponse = (content: DisciplineResponse[] = []): PageResponse<DisciplineResponse> => ({
    content,
    totalPages: 2,
    totalElements: content.length,
    pageable: { pageNumber: 0, pageSize: 10, offset: 0, paged: true, unpaged: false },
    last: false,
    first: true,
    size: 10,
    number: 0,
    sort: { sorted: false, unsorted: true, empty: true },
    numberOfElements: content.length,
    empty: content.length === 0,
});

describe('useDisciplines', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('carrega disciplinas automaticamente no mount (autoLoad = true)', async () => {
        mockDisciplineService.list.mockResolvedValueOnce(mockPageResponse([
            { id: 1, nome: 'Matemática', codigo: 'MAT101', cargaHoraria: 60, professorId: 1 }
        ]));

        const { result } = renderHook(() => useDisciplines());

        expect(result.current.loading).toBe(true);

        await act(async () => { });

        expect(result.current.disciplines).toHaveLength(1);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(mockDisciplineService.list).toHaveBeenCalledWith(0, 10, undefined);
    });

    it('não carrega automaticamente quando autoLoad = false', async () => {
        const { result } = renderHook(() => useDisciplines({ autoLoad: false }));

        expect(result.current.disciplines).toEqual([]);
        expect(mockDisciplineService.list).not.toHaveBeenCalled();
    });

    it('define erro quando list falha', async () => {
        mockDisciplineService.list.mockRejectedValueOnce(new Error('Falha na API'));

        const { result } = renderHook(() => useDisciplines());

        await act(async () => { });

        expect(result.current.error).toBe('Falha na API');
        expect(result.current.loading).toBe(false);
    });

    it('deleta disciplina e recarrega lista', async () => {
        mockDisciplineService.delete.mockResolvedValueOnce(undefined);
        mockDisciplineService.list.mockResolvedValue(mockPageResponse([]));

        const { result } = renderHook(() => useDisciplines({ autoLoad: false }));

        await act(async () => {
            const ok = await result.current.deleteDiscipline(1);
            expect(ok).toBe(true);
        });

        expect(mockDisciplineService.delete).toHaveBeenCalledWith(1);
        expect(mockDisciplineService.list).toHaveBeenCalled();
    });

    it('define erro se delete falhar', async () => {
        mockDisciplineService.delete.mockRejectedValueOnce(new Error('Erro delete'));

        const { result } = renderHook(() => useDisciplines({ autoLoad: false }));

        await act(async () => {
            const ok = await result.current.deleteDiscipline(1);
            expect(ok).toBe(false);
        });

        expect(result.current.error).toBe('Erro delete');
    });

    it('refresh recarrega página atual', async () => {
        mockDisciplineService.list.mockResolvedValue(mockPageResponse([]));

        const { result } = renderHook(() => useDisciplines({ autoLoad: false }));

        await act(async () => {
            result.current.refresh();
        });

        expect(mockDisciplineService.list).toHaveBeenCalledWith(0, 10, undefined);
    });

    it('clearError reseta o erro', async () => {
        mockDisciplineService.list.mockRejectedValueOnce(new Error('Errozinho'));

        const { result } = renderHook(() => useDisciplines());

        await act(async () => { });

        expect(result.current.error).toBe('Errozinho');

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
    });
});
