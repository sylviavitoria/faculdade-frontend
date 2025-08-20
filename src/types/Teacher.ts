export interface Teacher {
  nome: string;
  email: string;
  senha: string;
  id?: number;
}

export interface TeacherResponse {
  id: number;
  nome: string;
  email: string;
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
