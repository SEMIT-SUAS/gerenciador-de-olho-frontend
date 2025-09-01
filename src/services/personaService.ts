import { api } from '@/lib/axios';
import type { Persona } from '@/types/Persona';
import { AxiosError } from 'axios';
import { BaseServiceClass } from './BaseServiceClass'; // Supondo o uso de uma classe base

export class PersonaService extends BaseServiceClass {
  // Erros específicos para o serviço de Persona
  protected readonly createError = new Error(
    'Não foi possível cadastrar a persona.',
  );
  protected readonly getAllError = new Error(
    'Não foi possível listar as personas.',
  );
  protected readonly getByIdError = new Error(
    'Não foi possível buscar a persona.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar a persona.',
  );

  /**
   * Lista todas as personas ativas.
   */
  public async getAll(): Promise<Persona[]> {
    try {
      const response = await api.get<Persona[]>(
        '/persona-servico/listar-ativos',
      );
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  /**
   * Busca uma persona específica pelo ID.
   */
  public async getById(id: number): Promise<Persona> {
    try {
      const response = await api.get<Persona>(`/persona-servico/buscar/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw this.getByIdError;
    }
  }

  /**
   * Cria uma nova persona a partir de um FormData.
   * (Anteriormente 'uploadPersona')
   */
  public async create(formData: FormData): Promise<Persona> {
    try {
      // É mais útil que o endpoint de criação retorne o objeto criado.
      const response = await api.post<Persona>(
        '/persona-servico/cadastrar',
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
   * Atualiza uma persona existente a partir de um FormData.
   */
  public async update(formData: FormData): Promise<void> {
    try {
      await api.put('/persona-servico/atualizar', formData);
    } catch (error) {
      // Extrai a mensagem de erro da API se disponível
      if (error instanceof AxiosError && error.response?.data) {
        const errorMessage =
          typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message;
        if (errorMessage) throw new Error(errorMessage);
      }
      throw this.updateError;
    }
  }

  public async toggleVisibility(id: number, visivel: boolean): Promise<void> {
    try {
      await api.put('/persona-servico/atualizar/visibilidade', { id, visivel });
    } catch (error) {
      throw this.updateError;
    }
  }

  public async toggleAtivo(id: number, ativo: boolean): Promise<void> {
    const body = JSON.stringify({ id, ativo });
    try {
      await api.put('/persona-servico/atualizar/atividade', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw this.updateError;
    }
  }
}

// Exporta uma instância única (Singleton) do serviço.
export const personaService = new PersonaService();
