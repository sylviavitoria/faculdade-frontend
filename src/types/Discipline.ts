export interface Discipline {
  nome: string;
  codigo: string;
  cargaHoraria?: number;
  professorId?: number;
  id?: number;
}

export interface DisciplineResponse {
  id: number;
  nome: string;
  codigo: string;
  cargaHoraria: number;
  professor?: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}
