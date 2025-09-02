import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { BaseServiceClass } from './BaseServiceClass';
import { api } from '@/lib/axios';

export class TipoDenunciaService extends BaseServiceClass {
  protected readonly getAllError = new Error(
    'Não foi possível listar os tipos de denúncia.',
  );
  protected readonly createError = new Error(
    'Não foi possível criar o tipo de denúncia.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar o tipo de denúncia.',
  );
  protected readonly serverError = new Error(
    'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
  );

  public async getAll(): Promise<TipoDenunciaModel[]> {
    try {
      const response = await api.get('/tipo-denuncia/listar-ativos', {});
      return response.data as TipoDenunciaModel[];
    } catch (error) {
      throw this.getAllError;
    }
  }

  public async create(formData: FormData): Promise<TipoDenunciaModel> {
    try {
      const response = await api.post<TipoDenunciaModel>(
        '/tipo-denuncia/cadastrar',
        formData,
      );
      return response.data;
    } catch (error) {
      throw this.createError;
    }
  }

  public async update(formData: FormData): Promise<TipoDenunciaModel> {
    try {
      const response = await api.put<TipoDenunciaModel>(
        '/tipo-denuncia/atualizar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw this.updateError;
    }
  }

  public async toggleAtivo(id: number, ativo: boolean): Promise<void> {
    const body = JSON.stringify({ id, ativo });
    try {
      await api.put('/tipo-denuncia/atualizar/atividade', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw this.updateError;
    }
  }

  public async toggleVisibility(id: number, visivel: boolean): Promise<void> {
    const body = JSON.stringify({ id, visivel });

    try {
      await api.put('/tipo-denuncia/atualizar/visibilidade', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw this.updateError;
    }
  }
}

export const tipoDenunciaService = new TipoDenunciaService();
