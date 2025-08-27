import { api } from '@/config/api'; // Importa a instância do Axios
import type { Servicos, UpdateServiceModel } from '@/types/Servicos';
import type { ServicosListar } from '@/types/ServicosListar';
import { BaseServiceClass } from './BaseServiceClass'; // Supondo o uso de uma classe base

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

  /**
   * Lista todos os serviços ativos.
   */
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

  /**
   * Lista todos os serviços marcados como visíveis.
   */
  public async getAllVisible(): Promise<Servicos[]> {
    try {
      const response = await api.get<Servicos[]>('/servico/visiveis');
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  /**
   * Busca um serviço específico pelo ID.
   * @param id O ID do serviço.
   */
  public async getById(id: number): Promise<Servicos> {
    try {
      const response = await api.get<Servicos>(`/servico/buscar/${id}`);
      return response.data;
    } catch (error) {
      throw this.getByIdError;
    }
  }

  /**
   * Cria um novo serviço.
   * @param servico Os dados do serviço a ser criado.
   */
  public async create(servico: Servicos): Promise<Servicos> {
    try {
      const response = await api.post<Servicos>('/servico/cadastrar', servico);
      return response.data;
    } catch (error) {
      throw this.createError;
    }
  }

  /**
   * Atualiza um serviço existente.
   * @param servico Os dados do serviço a serem atualizados.
   */
  public async update(
    servico: UpdateServiceModel,
  ): Promise<UpdateServiceModel> {
    try {
      const response = await api.put<UpdateServiceModel>(
        '/servico/atualizar',
        servico,
      );
      return response.data;
    } catch (error) {
      throw this.updateError;
    }
  }

  /**
   * Altera a visibilidade de um serviço.
   * @param id O ID do serviço.
   * @param visivel O novo estado de visibilidade.
   */
  public async toggleVisibility(
    id: number,
    visivel: boolean,
  ): Promise<ServicosListar> {
    try {
      const response = await api.put<ServicosListar>(
        '/servico/atualizar/visibilidade',
        { id, visivel },
      );
      return response.data;
    } catch (error) {
      throw this.updateError;
    }
  }

  /**
   * Altera o status de "ativo" de um serviço.
   * @param id O ID do serviço.
   * @param ativo O novo estado de atividade.
   */
  public async toggleAtivo(id: number, ativo: boolean): Promise<Servicos> {
    try {
      const response = await api.put<Servicos>('/servico/atualizar/atividade', {
        id,
        ativo,
      });
      return response.data;
    } catch (error) {
      throw this.updateError;
    }
  }
}

// Exporta uma instância única (Singleton) do serviço.
export const servicoService = new ServicoService();
