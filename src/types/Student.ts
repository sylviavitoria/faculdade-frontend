export interface Student {
  nome: string;
  email: string;
  matricula: string;
  senha: string;
  id?: number;
}

export interface StudentResponse {
  id: number;
  nome: string;
  email: string;
  matricula: string;
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
