export interface Student {
  name: string;
  email: string;
  registrationNumber: string;
  password: string;
  id?: number;
}

export interface StudentResponse {
  id: number;
  name: string;
  email: string;
  registrationNumber: string;
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
