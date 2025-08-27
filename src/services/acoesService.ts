import type {
  AcaoDetailsModel,
  AcaoHistory,
  AcaoInMap,
  AcaoModel,
  CreateAcaoModel,
} from '../types/Acao';
import { api } from '@/lib/axios';

export default class AcoesService {
  public static async create(data: CreateAcaoModel) {
    try {
      const body = JSON.stringify(data);

      const response = await api.post('/acao/cadastrar', body, {
        responseType: 'json',
        headers: {
          'Content-Type': 'Application/json',
        },
      });

      if (response.status !== 201) {
        throw new Error('Não foi possível criar á ação.');
      }

      return response.data.acao;
    } catch {
      throw new Error('Serviço de ação fora do ar. Tente novamente mais tarde');
    }
  }

  public static async getFilteredAcoes(data: {
    status: string | null;
    secretaria: number;
    bairro: string;
  }): Promise<AcaoInMap[]> {
    try {
      const response = await api.get('/acao/filtro-acao', {
        params: {
          status: data.status,
          secretaria: data.secretaria,
          bairro: data.bairro,
        },
      });

      if (response.status !== 200) {
        throw new Error('Não foi possível buscar as ações por bairro.');
      }

      return response.data;
    } catch (error) {
      throw new Error(
        'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
      );
    }
  }

  public static async getAcaoById(acaoId: number): Promise<AcaoDetailsModel> {
    try {
      const response = await api.get('/acao/buscar/' + acaoId, {
        responseType: 'json',
      });

      if (response.status != 200) {
        throw new Error('Não foi possível encontrar os detalhes dessa ação.');
      }

      return response.data as AcaoDetailsModel;
    } catch {
      throw new Error(
        'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
      );
    }
  }

  public static async updateAcao(payload: any): Promise<AcaoModel> {
    try {
      const response = await api.put(`/acao/atualizar`, payload);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Não foi possível atualizar a ação.');
      }

      return response.data.acao;
    } catch (error) {
      throw new Error(
        'Ocorreu um erro no servidor ao tentar concluir a ação. Tente novamente.',
      );
    }
  }

  public static async vincularDenunciaAcao(payload: any): Promise<AcaoModel> {
    try {
      const response = await api.put(`/acao/atualizar`, payload);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Não foi possível atualizar a ação.');
      }

      return response.data.acao;
    } catch (error) {
      throw new Error(
        'Ocorreu um erro no servidor ao tentar concluir a ação. Tente novamente.',
      );
    }
  }

  public static async getAcaoHistory(acaoId: number): Promise<AcaoHistory[]> {
    try {
      const response = await api.get(`/acao/historico-status/${acaoId}`);

      return response.data;
    } catch (error) {
      throw new Error(
        'Ocorreu um erro no servidor ao tentar buscar o histórico da ação. Tente novamente.',
      );
    }
  }
}
