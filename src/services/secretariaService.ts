import { api } from '@/lib/axios';
import type { createSecretaria, Secretaria } from '../types/Secretaria'; // Ajuste o caminho conforme necessário
import { BaseServiceClass } from './BaseServiceClass'; // Supondo que você tenha uma classe base
import { AxiosError } from 'axios';

export class SecretariaService extends BaseServiceClass {
  protected readonly getAllError = new Error(
    'Não foi possível listar as secretarias.',
  );
  protected readonly getByIdError = new Error(
    'Não foi possível buscar a secretaria.',
  );
  protected readonly createError = new Error(
    'Não foi possível cadastrar a secretaria.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar a secretaria.',
  );
  protected readonly deleteError = new Error(
    'Não foi possível deletar a secretaria.',
  );

  public async getAll(): Promise<Secretaria[]> {
    try {
      const response = await api.get('/secretaria/listar-todas');
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  public async getById(id: number): Promise<Secretaria> {
    try {
      const response = await api.get<Secretaria>(`/secretaria/buscar/${id}`);
      return response.data;
    } catch (error) {
      throw this.getByIdError;
    }
  }

  public async create(data: createSecretaria): Promise<Secretaria> {
    try {
      const body = JSON.stringify(data);
      const response = await api.post('/secretaria/cadastrar', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw this.createError;
    }
  }

  public async update(
    id: number,
    data: Partial<createSecretaria>,
  ): Promise<Secretaria> {
    try {
      const response = await api.put(`/secretaria/${id}`, data);
      return JSON.parse(response.data);
    } catch (error) {
      throw this.updateError;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await api.delete(`/secretaria/${id}`);
    } catch (error) {
      throw this.deleteError;
    }
  }

  public async toggleVisibility(secretariaId: number, visibilidade: boolean) {
    secretariaId + 1;
    visibilidade!;
    return null;
  }
}

export const secretariaService = new SecretariaService();
