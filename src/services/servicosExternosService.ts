import { api } from '@/config/api'; // Importa a instância configurada do Axios
import type { ServicoExterno } from '@/types/ServicoExterno';
import { AxiosError } from 'axios';
import { BaseServiceClass } from './BaseServiceClass'; // Supondo o uso de uma classe base

export class ServicoExternoService extends BaseServiceClass {
  // Erros específicos para o serviço
  protected readonly createError = new Error(
    'Não foi possível cadastrar o serviço externo.',
  );
  protected readonly getAllError = new Error(
    'Não foi possível listar os serviços externos.',
  );
  protected readonly getByIdError = new Error(
    'Não foi possível buscar o serviço externo.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar o serviço externo.',
  );

  /**
   * Cria um novo serviço externo a partir de um FormData.
   * (Anteriormente 'uploadServicoExterno')
   */
  public async create(formData: FormData): Promise<ServicoExterno> {
    try {
      const response = await api.post<ServicoExterno>(
        '/servico-externo/cadastrar',
        formData,
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw this.createError;
    }
  }

  /**
   * Lista todos os serviços externos ativos.
   */
  public async getAll(): Promise<ServicoExterno[]> {
    try {
      const response = await api.get<ServicoExterno[]>(
        '/servico-externo/listar-ativos',
      );
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  /**
   * Busca um serviço externo específico pelo ID.
   */
  public async getById(id: number): Promise<ServicoExterno> {
    try {
      const response = await api.get<ServicoExterno>(
        `/servico-externo/buscar/${id}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw this.getByIdError;
    }
  }

  /**
   * Atualiza um serviço externo a partir de um FormData.
   */
  public async update(
    formData: FormData,
  ): Promise<ServicoExterno | { retorno: string }> {
    try {
      const response = await api.put('/servico-externo/atualizar', formData);
      // Lida com a resposta que pode ser JSON ou texto
      if (typeof response.data === 'string') {
        return { retorno: response.data };
      }
      return response.data as ServicoExterno;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw this.updateError;
    }
  }

  /**
   * Altera a visibilidade de um serviço externo.
   */
  public async toggleVisibility(
    id: number,
    visivel: boolean,
  ): Promise<ServicoExterno | { retorno: string }> {
    try {
      const response = await api.put(
        '/servico-externo/atualizar/visibilidade',
        { id, visivel },
      );
      // Lida com a resposta que pode ser JSON ou texto
      if (typeof response.data === 'string') {
        return { retorno: response.data };
      }
      return response.data as ServicoExterno;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw this.updateError;
    }
  }

  /**
   * Altera o status de "ativo" de um serviço externo.
   * Este endpoint parece retornar apenas uma mensagem de texto.
   */
  public async toggleAtivo(id: number, ativo: boolean): Promise<string> {
    try {
      const response = await api.put(
        '/servico-externo/atualizar/atividade',
        { id, ativo },
        {
          // Diz ao Axios para não tentar parsear a resposta como JSON
          transformResponse: (data) => data,
        },
      );
      return response.data;
    } catch (error) {
      throw this.updateError;
    }
  }
}

// Exporta uma instância única (Singleton) do serviço.
export const servicoExternoService = new ServicoExternoService();
