import { AxiosError } from 'axios';
import { api } from '@/config/api.ts';

import type {
  DenunciaBasicInfoModel,
  DenunciaInMap,
  DenunciaModel,
} from '../types/Denuncia.ts';
import type { NumeroDeDenunciasPorBairro } from '@/types/Bairro';
import type { DenunciaIndeferidaModel } from '@/types/DenunciaIndeferidaModel.ts';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia.ts';

export class DenunciaService {
  private static SERVICE_UNAVAILABLE_ERROR = new Error(
    'Serviço de denúncia indisponível. Tente novamente mais tarde.',
  );

  public static async getAllBasicInfos(): Promise<DenunciaBasicInfoModel[]> {
    try {
      const response = await api.get('/denuncia/listar-todos', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status != 200) {
        throw new Error('Não foi possível buscar as denúncias.');
      }
      // return JSON.parse(response.data);
      return response.data;
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getById(denunciaId: number): Promise<DenunciaModel> {
    try {
      const response = await api.get(
        `/denuncia/buscar-denuncia/${denunciaId}`,
        {
          responseType: 'json',
        },
      );

      if (response.status != 200) {
        throw new Error('Não foi possível buscar essa denúncia.');
      }

      // return JSON.parse(response.data);
      return response.data;
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getFilesByDenunciaId(
    denunciaId: number,
  ): Promise<string[]> {
    try {
      const response = await api.get<string[]>(
        `/denuncia/arquivos/uploads/${denunciaId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Falha ao buscar arquivos da denúncia ${denunciaId}:`,
        error,
      );
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getNumberDenunciasInMap(
    status: string | null,
    secretaria: number,
  ): Promise<NumeroDeDenunciasPorBairro[]> {
    try {
      const response = await api.get('/denuncia/contador-denuncias-bairro', {
        params: {
          status,
          secretaria,
        },
        responseType: 'json',
      });

      // return JSON.parse(response.data) as NumeroDeDenunciasPorBairro[];
      return response.data;
    } catch (error) {
      console.error('Falha ao buscar o número de denúncias no mapa:', error);
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async desvincularAcao(denunciaId: number): Promise<void> {
    try {
      await api.patch(`/denuncia/denuncias/desvincular-acao/${denunciaId}`);
    } catch (error) {
      console.error(
        `Falha ao desvincular ação da denúncia ${denunciaId}:`,
        error,
      );
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async indeferirDenuncia({
    denunciaId,
    userId,
    motivo,
  }: {
    denunciaId: number;
    userId: number;
    motivo: string;
  }): Promise<DenunciaIndeferidaModel> {
    try {
      const response = await api.post(
        '/denuncia-indeferida/cadastrar/' + denunciaId,
        JSON.stringify({
          motivo,
          denuncia: denunciaId,
          gerenciador: userId,
          ativo: true,
        }),
        {
          headers: {
            'Content-Type': 'Application/json',
          },
        },
      );

      if (response.status != 201) {
        throw new Error('Não foi possível indeferir essa denuncia');
      }

      const responseData = JSON.parse(response.data);
      const indeferimentoData = responseData.denuncia
        .denunciaIndeferida as DenunciaIndeferidaModel;

      return indeferimentoData;
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getDenunciaPorBairro(data: {
    status: string | null;
    secretaria: number;
    bairro: string;
    'tipo-denuncia': string | null | TipoDenunciaModel;
  }): Promise<DenunciaInMap[]> {
    try {
      const response = await api.get(`/denuncia/filtro-denuncias`, {
        params: data,
        responseType: 'json',
      });

      if (response.status !== 200) {
        throw new Error('Não foi possível buscar as denúncias por bairro.');
      }

      // return JSON.parse(response.data) as DenunciaInMap[];
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return [];
      }
      console.error('Erro ao buscar denúncias por bairro:', error);
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }
}
