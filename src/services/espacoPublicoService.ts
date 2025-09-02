import { api } from '@/lib/axios';
import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import { BaseServiceClass } from './BaseServiceClass'; // Supondo o uso de uma classe base

export class EspacoPublicoService extends BaseServiceClass {
  // Definição de erros específicos para este serviço
  protected readonly createError = new Error(
    'Não foi possível cadastrar o espaço público.',
  );
  protected readonly getError = new Error(
    'Não foi possível buscar o espaço público.',
  );
  protected readonly getAllError = new Error(
    'Não foi possível listar os espaços públicos.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar o espaço público.',
  );
  protected readonly serviceUnavailableError = new Error(
    'Serviço indisponível no momento. Tente novamente mais tarde.',
  );

  protected readonly deleteError = new Error(
    'Não foi possível apagar arquivos no momento. Tente novamente mais tarde.',
  );

  public async create(formData: FormData): Promise<void> {
    try {
      const response = await api.post<EspacoPublicoModel>(
        '/espaco-publico/cadastrar',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (response.status != 201) {
        throw this.createError;
      }
    } catch (error) {
      throw this.createError;
    }
  }

  public async getById(espacoPublicoId: number): Promise<EspacoPublicoModel> {
    try {
      const response = await api.get<EspacoPublicoModel>(
        `/espaco-publico/buscar/${espacoPublicoId}`,
      );
      return response.data;
    } catch (error) {
      throw this.getError;
    }
  }

  /**
   * Lista todos os espaços públicos ativos.
   */
  public async getAll(): Promise<EspacoPublicoModel[]> {
    try {
      const response = await api.get<EspacoPublicoModel[]>(
        '/espaco-publico/listar-ativos',
      );
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  public async toggleVisibility(id: number, visivel: boolean): Promise<void> {
    const body = JSON.stringify({ id, visivel });
    try {
      await api.put('/espaco-publico/atualizar/visibilidade', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw this.updateError;
    }
  }

  public async trash(id: number): Promise<void> {
    const body = JSON.stringify({ id, ativo: false });
    try {
      await api.put('/espaco-publico/atualizar/atividade', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw this.updateError;
    }
  }

  public async deleteFile(espacoPublicoId: string, fileName: string) {
    try {
      await api.delete(
        `/espaco-publico/${espacoPublicoId}/arquivos/${fileName}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      throw this.deleteError;
    }
  }
}

export const espacoPublicoService = new EspacoPublicoService();
