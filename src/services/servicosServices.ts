import { api } from '@/lib/axios';
import type { Servicos, UpdateServiceModel } from '@/types/Servicos';
import type { ServicosListar } from '@/types/ServicosListar';
import { BaseServiceClass } from './BaseServiceClass'; // Supondo o uso de uma classe base
import { AxiosError } from 'axios';

export class ServicoService extends BaseServiceClass {
  // Erros específicos para o serviço de "Serviços"
  protected readonly getAllError = new Error(
    'Não foi possível listar os serviços.',
  );
  protected readonly getByIdError = new Error(
    'Não foi possível buscar o serviço.',
  );
  protected readonly createError = new Error(
    'Não foi possível criar o serviço.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar o serviço.',
  );
  protected readonly serviceUnavailableError = new Error(
    'Serviço indisponível. Tente novamente mais tarde.',
  );

  public async getAll(): Promise<ServicosListar[]> {
    try {
      const response = await api.get<ServicosListar[]>(
        '/servico/listar-ativos',
      );
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  public async getAllVisible(): Promise<Servicos[]> {
    try {
      const response = await api.get<Servicos[]>('/servico/visiveis');
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  public async getById(id: number): Promise<UpdateServiceModel> {
    try {
      const response = await api.get(`/servico/buscar/${id}`, {
        headers: {
          'Content-Type': 'Application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw this.getByIdError;
    }
  }

  public async create(servico: Servicos): Promise<Servicos> {
    const servicoJSON = JSON.stringify(servico);
    try {
      const response = await api.post<Servicos>(
        '/servico/cadastrar',
        servicoJSON,
        {
          responseType: 'json',
        },
      );
      return response.data;
    } catch (error) {
      throw this.createError;
    }
  }

  public async update(
    servico: UpdateServiceModel,
  ): Promise<UpdateServiceModel> {
    try {
      const response = await api.put<UpdateServiceModel>(
        '/servico/atualizar',
        JSON.stringify(servico),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw this.updateError;
    }
  }

  public async toggleVisibility(
    id: number,
    visivel: boolean,
  ): Promise<ServicosListar> {
    const body = JSON.stringify({ id, visivel });

    try {
      const response = await api.put<ServicosListar>(
        '/servico/atualizar/visibilidade',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new Error('Serviço não encontrado para alterar a visibilidade.');
      }
      throw this.updateError;
    }
  }

  public async toggleAtivo(id: number, ativo: boolean): Promise<Servicos> {
    const body = JSON.stringify({ id, ativo });
    try {
      const response = await api.put<Servicos>(
        '/servico/atualizar/atividade',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw this.updateError;
    }
  }
}

export const servicoService = new ServicoService();
