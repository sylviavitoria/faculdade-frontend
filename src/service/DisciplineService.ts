import { AxiosResponse } from 'axios';
import api from './api';
import { Discipline, DisciplineResponse, PageResponse } from '../types/Discipline';
import { montarParametroOrdenacao } from '../utils/ordenacao';

export const disciplineService = {
  async create(disciplineData: Discipline): Promise<DisciplineResponse> {
    const response: AxiosResponse<DisciplineResponse> = await api.post('/disciplinas', disciplineData);
    return response.data;
  },

  async list(page: number = 0, size: number = 10, sort?: string): Promise<PageResponse<DisciplineResponse>> {
    const sortParam = montarParametroOrdenacao(sort, { campo: 'nome', direcao: 'asc' });

    const response: AxiosResponse<PageResponse<DisciplineResponse>> =
      await api.get(`/disciplinas?page=${page}&size=${size}${sortParam}`);
    return response.data;
  },

  async getById(id: number): Promise<DisciplineResponse> {
    const response: AxiosResponse<DisciplineResponse> = await api.get(`/disciplinas/${id}`);
    return response.data;
  },

  async update(id: number, disciplineData: Discipline): Promise<DisciplineResponse> {
    const response: AxiosResponse<DisciplineResponse> = await api.put(`/disciplinas/${id}`, disciplineData);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/disciplinas/${id}`);
  }
};
