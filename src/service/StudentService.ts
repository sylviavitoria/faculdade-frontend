import { AxiosResponse } from 'axios';
import api from './api';
import { Student, StudentResponse, PageResponse } from '../types/Student';
import { montarParametroOrdenacao } from '../utils/ordenacao';

export const studentService = {
  async create(studentData: Student): Promise<StudentResponse> {
    const response: AxiosResponse<StudentResponse> = await api.post('/alunos', studentData);
    return response.data;
  },

  async list(page: number = 0, size: number = 10, sort?: string): Promise<PageResponse<StudentResponse>> {
    const sortParam = montarParametroOrdenacao(sort, { campo: 'nome', direcao: 'asc' });

    const response: AxiosResponse<PageResponse<StudentResponse>> =
      await api.get(`/alunos?page=${page}&size=${size}${sortParam}`);
    return response.data;
  },

  async getById(id: number): Promise<StudentResponse> {
    const response: AxiosResponse<StudentResponse> = await api.get(`/alunos/${id}`);
    return response.data;
  },

  async update(id: number, studentData: Student): Promise<StudentResponse> {
    const response: AxiosResponse<StudentResponse> = await api.put(`/alunos/${id}`, studentData);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/alunos/${id}`);
  },

  async getMe(): Promise<StudentResponse> {
    const response: AxiosResponse<StudentResponse> = await api.get('/alunos/me');
    return response.data;
  }
};
