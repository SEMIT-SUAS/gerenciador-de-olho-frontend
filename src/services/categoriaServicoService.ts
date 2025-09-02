import { api } from '@/lib/axios';
import type {
  createServicoCategoria,
  ServicoCategoria,
} from '@/types/CategoriaServico';
import type { ServicoCategoriaEditar } from '@/types/ServicoCategoriaEditar';
import { BaseServiceClass } from './BaseServiceClass'; // Supondo o uso de uma classe base
import { AxiosError } from 'axios';

export class CategoriaServicoService extends BaseServiceClass {
  // Erros específicos para o serviço
  protected readonly getAllError = new Error(
    'Não foi possível listar as categorias.',
  );
  protected readonly createError = new Error(
    'Não foi possível cadastrar a categoria.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar a categoria.',
  );
  protected readonly serviceUnavailableError = new Error(
    'Serviço indisponível. Tente novamente mais tarde.',
  );

  /**
   * Lista todas as categorias de serviço ativas.
   */
  public async getAll(): Promise<ServicoCategoria[]> {
    try {
      const response = await api.get<ServicoCategoria[]>(
        '/categoria-servico/listar-ativos',
      );
      return response.data;
    } catch (error) {
      throw this.getAllError;
    }
  }

  public async create(categoria: createServicoCategoria): Promise<string> {
    const formData = new FormData();
    formData.append('nome', categoria.nome);
    formData.append('visivel', String(categoria.visivel));
    formData.append('ativo', String(categoria.ativo));
    if (categoria.icone) {
      formData.append('icone', categoria.icone);
    }

    try {
      const response = await api.post<string>(
        '/categoria-servico/cadastrar',
        formData,
        {
          transformResponse: (data) => data,
        },
      );
      return response.data;
    } catch (error) {
      throw this.createError;
    }
  }

  public async update(categoria: ServicoCategoriaEditar): Promise<string> {
    const formData = new FormData();
    formData.append('id', categoria.id.toString());
    formData.append('nome', categoria.nome);
    if (categoria.icone && categoria.icone instanceof File) {
      formData.append('icone', categoria.icone);
    }

    try {
      const response = await api.put<string>(
        '/categoria-servico/atualizar/layout',
        formData,
        {
          transformResponse: (data) => data,
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(`Erro ao editar categoria: ${error.response.data}`);
      }
      throw this.updateError;
    }
  }

  public async toggleAtivo(id: number, ativo: boolean): Promise<void> {
    const body = JSON.stringify({ id, ativo });

    try {
      await api.put('/categoria-servico/atualizar/atividade', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw this.updateError;
    }
  }

  /**
   * Altera a visibilidade de uma categoria.
   */
  public async toggleVisivel(id: number, visivel: boolean): Promise<void> {
    const body = JSON.stringify({ id, visivel });

    try {
      await api.put('/categoria-servico/atualizar/visibilidade', body, {
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
export const categoriaServicoService = new CategoriaServicoService();
