import type { AcaoInMap, AcaoModel, CreateAcaoModel } from '../types/Acao';
import { api } from '../config/api';

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

      return response.data;
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
      const response = await api.get('/acao/gerenciador/filtro-acao', {
        params: {
          status: data.status,
          secretaria: data.secretaria,
          bairro: data.bairro,
        },
      });

      console.log('Ações filtradas:', response);

      if (response.status !== 200) {
        throw new Error('Não foi possível buscar as ações por bairro.');
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar ações:', error);
      throw new Error(
        'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
      );
    }
  }

  // public static async createAcao(
  //   createAcaoData: CreateAcaoModel,
  // ): Promise<AcaoModel> {
  //   const centerCoordinates = getPolygonoCenter(
  //     createAcaoData.denuncias.map((d) => [d.latitude, d.longitude]),
  //   );

  //   const secretaria: Secretaria = secretariasMock.find(
  //     (sc) => sc.id === createAcaoData.secretariaId,
  //   )!;

  //   const acaoCreatedData: AcaoModel = {
  //     id: Math.floor(Math.random() * 100000),
  //     nome: createAcaoData.nome,
  //     obs: createAcaoData.obs,
  //     secretaria,
  //     latitude: centerCoordinates[0],
  //     longitude: centerCoordinates[1],
  //     criadoEm: new Date().toUTCString(),
  //     status: [
  //       {
  //         id: 1,
  //         motivo: 'Criada',
  //         AlteradoEm: new Date().toUTCString(),
  //         alteradoPor: userMock,
  //         status: 'em_analise',
  //       },
  //     ],
  //   };

  //   // Adiciona a nova ação ao nosso array mock.
  //   this.acoes.push(acaoCreatedData);
  //   return acaoCreatedData;
  // }

  public static async getAcaoById(acaoId: number): Promise<AcaoModel> {
    try {
      const response = await api.get('/acao/buscar/' + acaoId, {
        responseType: 'json',
      });

      if (response.status != 200) {
        throw new Error('Não foi possível encontrar os detalhes dessa ação.');
      }

      return response.data as AcaoModel;
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
      console.error('Erro ao concluir ação:', error);
      throw new Error(
        'Ocorreu um erro no servidor ao tentar concluir a ação. Tente novamente.',
      );
    }
  }

  public static async vincularDenunciaAcao(payload: any): Promise<AcaoModel> {
    console.log('Vincular denúncias com payload:', payload);
    try {
      const response = await api.put(`/acao/atualizar`, payload);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Não foi possível atualizar a ação.');
      }

      return response.data.acao;
    } catch (error) {
      console.error('Erro ao concluir ação:', error);
      throw new Error(
        'Ocorreu um erro no servidor ao tentar concluir a ação. Tente novamente.',
      );
    }
  }
}
