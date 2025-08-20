import { AxiosResponse } from 'axios';
import api from './api';
import { Registration, RegistrationResponse, NotaRequest, PageResponse } from '../types/Registration';
import { montarParametroOrdenacao } from '../utils/ordenacao';

export const registrationService = {
  async create(registrationData: Registration): Promise<RegistrationResponse> {
    const response: AxiosResponse<RegistrationResponse> = await api.post('/matriculas', registrationData);
    return response.data;
  },

  async list(page: number = 0, size: number = 10, sort?: string): Promise<PageResponse<RegistrationResponse>> {
    const sortParam = montarParametroOrdenacao(sort, { campo: 'dataMatricula', direcao: 'desc' });

    const response: AxiosResponse<PageResponse<RegistrationResponse>> =
      await api.get(`/matriculas?page=${page}&size=${size}${sortParam}`);
    return response.data;
  },

  async getById(id: number): Promise<RegistrationResponse> {
    const response: AxiosResponse<RegistrationResponse> = await api.get(`/matriculas/${id}`);
    return response.data;
  },

  async updateNotas(id: number, notasData: NotaRequest): Promise<RegistrationResponse> {
    const response: AxiosResponse<RegistrationResponse> = await api.put(`/matriculas/${id}/notas`, notasData);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/matriculas/${id}`);
  }
};
