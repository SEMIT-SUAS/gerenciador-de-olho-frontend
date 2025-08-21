import type { AcaoInMap, AcaoModel, CreateAcaoModel } from '../types/Acao';
import { api, API_BASE_URL } from '../config/api';
import { getPolygonoCenter } from '../utils/geometry';
import type { Secretaria } from '../types/Secretaria';
import { secretariasMock, userMock } from '../constants/mocks';

export default class AcoesService {
  public static acoes: AcaoModel[] = [];

  public static async getFilteredAcoes(data: {
    status: string;
    secretaria: number;
    bairro: string;
  }): Promise<AcaoInMap[]> {
    try {
      const response = await api.get(`/acao/gerenciador/filtro-acao`, {
        params: {
          params: data,
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

  public static async createAcao(
    createAcaoData: CreateAcaoModel,
  ): Promise<AcaoModel> {
    const centerCoordinates = getPolygonoCenter(
      createAcaoData.denuncias.map((d) => [d.latitude, d.longitude]),
    );

    const secretaria: Secretaria = secretariasMock.find(
      (sc) => sc.id === createAcaoData.secretariaId,
    )!;

    const acaoCreatedData: AcaoModel = {
      id: Math.floor(Math.random() * 100000),
      nome: createAcaoData.nome,
      obs: createAcaoData.obs,
      secretaria,
      latitude: centerCoordinates[0],
      longitude: centerCoordinates[1],
      criadoEm: new Date().toUTCString(),
      status: [
        {
          id: 1,
          motivo: 'Criada',
          AlteradoEm: new Date().toUTCString(),
          alteradoPor: userMock,
          status: 'em_analise',
        },
      ],
    };

    // Adiciona a nova ação ao nosso array mock.
    this.acoes.push(acaoCreatedData);
    return acaoCreatedData;
  }

  /**
   * Busca uma ação específica na API pelo seu ID.
   * @param {number} id - O ID da ação a ser buscada.
   * @returns {Promise<AcaoModel>} Uma promessa que resolve para a ação encontrada.
   */
  public static async getAcaoById(id: number): Promise<AcaoModel> {
    try {
      const response = await fetch(`${API_BASE_URL}/acoes/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Não foi possível encontrar a ação.');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em getAcaoById:', error);
      throw new Error(
        'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
      );
    }
  }

  /**
   * Atualiza uma ação na API.
   * @param {AcaoModel} acao - O objeto da ação com os dados atualizados.
   * @returns {Promise<AcaoModel>} Uma promessa que resolve para a ação atualizada.
   */
  public static async updateAcao(acao: AcaoModel): Promise<AcaoModel> {
    try {
      const response = await fetch(`${API_BASE_URL}/acoes/${acao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(acao),
      });

      if (!response.ok) {
        throw new Error('Não foi possível atualizar a ação.');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em updateAcao:', error);
      throw new Error(
        'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
      );
    }
  }
}
