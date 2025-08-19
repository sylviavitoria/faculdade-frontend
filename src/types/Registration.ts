export interface Registration {
  alunoId: number;
  disciplinaId: number;
  id?: number;
}

export interface RegistrationResponse {
  id: number;
  aluno: {
    id: number;
    nome: string;
    email: string;
    matricula: string;
  };
  disciplina: {
    id: number;
    nome: string;
    cargaHoraria: number;
  };
  nota1?: number;
  nota2?: number;
  status: 'APROVADA' | 'REPROVADA' | 'PENDENTE';
  dataMatricula: string;
}

export interface NotaRequest {
  nota1?: number;
  nota2?: number;
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
