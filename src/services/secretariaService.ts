import { api } from '@/lib/axios';
import type { createSecretaria, Secretaria } from '../types/Secretaria'; // Ajuste o caminho conforme necessário
import { BaseServiceClass } from './BaseServiceClass'; // Supondo que você tenha uma classe base
import { AxiosError } from 'axios';

export class SecretariaService extends BaseServiceClass {
  // Definindo mensagens de erro para o serviço
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

  /**
   * Busca todas as secretarias.
   */
  public async getAll(): Promise<Secretaria[]> {
    try {
      const response = await api.get('/secretaria/listar-todas');
      return JSON.parse(response.data);
    } catch (error) {
      throw this.getAllError;
    }
  }

  /**
   * Busca uma secretaria específica pelo seu ID.
   */
  public async getById(id: number): Promise<Secretaria> {
    try {
      // Este método já estava correto, apenas o integramos na classe
      const response = await api.get<Secretaria>(`/secretaria/buscar/${id}`);
      return response.data;
    } catch (error) {
      throw this.getByIdError;
    }
  }

  /**
   * Cria uma nova secretaria. (Anteriormente 'uploadSecretaria')
   * @param data Os dados da secretaria a ser criada.
   */
  public async create(data: createSecretaria): Promise<Secretaria> {
    try {
      // É mais comum que um endpoint de criação retorne o objeto criado.
      // Ajustei o retorno para Promise<Secretaria>. Se sua API retorna outra coisa, podemos ajustar.
      const response = await api.post('/secretaria/cadastrar', data);
      return JSON.parse(response.data);
    } catch (error) {
      // Tenta extrair uma mensagem de erro mais específica da resposta da API
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw this.createError;
    }
  }

  /**
   * Atualiza uma secretaria existente.
   * @param id O ID da secretaria a ser atualizada.
   * @param data Os novos dados para a secretaria.
   */
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

  /**
   * Deleta (ou desativa) uma secretaria.
   * @param id O ID da secretaria a ser deletada.
   */
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

// Exportando uma instância única (Singleton) para ser usada na aplicação
export const secretariaService = new SecretariaService();
