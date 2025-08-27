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

  /**
   * Cadastra um novo espaço público.
   * @param formData Os dados do formulário para o novo espaço.
   * @returns O espaço público criado.
   */
  public async create(formData: FormData): Promise<EspacoPublicoModel> {
    try {
      // É comum que a API retorne o objeto criado. Ajustei o retorno.
      const response = await api.post<EspacoPublicoModel>(
        '/espaco-publico/cadastrar',
        formData,
      );
      return response.data;
    } catch (error) {
      throw this.createError;
    }
  }

  /**
   * Busca um espaço público específico pelo ID.
   * @param espacoPublicoId O ID do espaço público.
   */
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

  /**
   * Altera a visibilidade de um espaço público.
   * @param id O ID do espaço público.
   * @param visivel O novo estado de visibilidade.
   */
  public async toggleVisibility(id: number, visivel: boolean): Promise<void> {
    try {
      // Axios envia o objeto como JSON automaticamente
      await api.put('/espaco-publico/atualizar/visibilidade', { id, visivel });
    } catch (error) {
      throw this.updateError;
    }
  }

  /**
   * Desativa um espaço público (soft delete).
   * @param id O ID do espaço público.
   */
  public async trash(id: number): Promise<void> {
    try {
      await api.put('/espaco-publico/atualizar/atividade', {
        id,
        ativo: false,
      });
    } catch (error) {
      throw this.updateError;
    }
  }
}

// Exporta uma instância única (Singleton) para ser usada em toda a aplicação.
export const espacoPublicoService = new EspacoPublicoService();
