import { AxiosResponse } from 'axios';
import api from './api';
import { Teacher, TeacherResponse, PageResponse } from '../types/Teacher';
import { montarParametroOrdenacao } from '../utils/ordenacao';

export const teacherService = {
  async create(teacherData: Teacher): Promise<TeacherResponse> {
    const response: AxiosResponse<TeacherResponse> = await api.post('/professores', teacherData);
    return response.data;
  },

  async list(page: number = 0, size: number = 10, sort?: string): Promise<PageResponse<TeacherResponse>> {
    const sortParam = montarParametroOrdenacao(sort, { campo: 'nome', direcao: 'asc' });

    const response: AxiosResponse<PageResponse<TeacherResponse>> =
      await api.get(`/professores?page=${page}&size=${size}${sortParam}`);
    return response.data;
  },

  async getById(id: number): Promise<TeacherResponse> {
    const response: AxiosResponse<TeacherResponse> = await api.get(`/professores/${id}`);
    return response.data;
  },

  async update(id: number, teacherData: Teacher): Promise<TeacherResponse> {
    const response: AxiosResponse<TeacherResponse> = await api.put(`/professores/${id}`, teacherData);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/professores/${id}`);
  },

  async getMe(): Promise<TeacherResponse> {
    const response: AxiosResponse<TeacherResponse> = await api.get('/professores/me');
    return response.data;
  }
};
