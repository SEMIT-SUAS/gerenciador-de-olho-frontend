import { api } from '@/lib/axios';
import type { CreatePortal, Portais } from '@/types/Portais';
import { BaseServiceClass } from './BaseServiceClass'; // Supondo o uso de uma classe base

export class PortalService extends BaseServiceClass {
  // Erros específicos para o serviço de Portais
  protected readonly getAllError = new Error(
    'Não foi possível listar os portais.',
  );
  protected readonly createError = new Error(
    'Não foi possível criar o portal.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar o portal.',
  );
  protected readonly serviceUnavailableError = new Error(
    'Serviço indisponível. Tente novamente mais tarde.',
  );

  /**
   * Lista todos os portais ativos.
   */
  public async getAll(): Promise<Portais[]> {
    try {
      const response = await api.get<Portais[]>('/portal/listar-ativos');
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  /**
   * Cria um novo portal.
   * @param portal Os dados do portal a ser criado.
   */
  public async create(portal: CreatePortal): Promise<Portais> {
    const body = JSON.stringify(portal);

    try {
      const response = await api.post<Portais>('/portal/cadastrar', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.createError;
    }
  }

  /**
   * Atualiza um portal existente.
   * @param portal Os dados do portal a serem atualizados.
   */
  public async update(portal: Portais): Promise<Portais> {
    const body = JSON.stringify(portal);

    try {
      const response = await api.put<Portais>('/portal/atualizar', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.updateError;
    }
  }

  /**
   * Ativa ou desativa um portal.
   * @param id O ID do portal.
   * @param ativo O novo estado de atividade.
   */
  public async toggleAtivo(id: number, ativo: boolean): Promise<void> {
    const body = JSON.stringify({ id, ativo });

    try {
      await api.put('/portal/atualizar/atividade', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw this.updateError;
    }
  }

  /**
   * Altera a visibilidade de um portal.
   * @param id O ID do portal.
   * @param visivel O novo estado de visibilidade.
   */
  public async toggleVisibility(id: number, visivel: boolean): Promise<void> {
    const body = JSON.stringify({ id, visivel });

    try {
      await api.put('/portal/atualizar/visibilidade', body, {
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
export const portalService = new PortalService();
