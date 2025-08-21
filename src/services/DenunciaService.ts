import { api } from '@/lib/axios.ts';
import { AxiosError } from 'axios'; // Importar AxiosError para um tratamento mais robusto

import type {
  DenunciaBasicInfoModel,
  DenunciaInMap,
  DenunciaModel,
  DenunciaStatusModelTypes,
} from '../types/Denuncia.ts';
import type { Bairro, NumeroDeDenunciasPorBairro } from '@/types/Bairro';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia.ts';
import type { Secretaria } from '@/types/Secretaria.ts';

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
      return JSON.parse(response.data);
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getById(denunciaId: number): Promise<DenunciaModel> {
    try {
      const response = await api.get(
        `/denuncia/gerenciador/buscar-denuncia/${denunciaId}`,
        {
          responseType: 'json',
        },
      );

      if (response.status != 200) {
        throw new Error('Não foi possível buscar essa denúncia.');
      }

      return JSON.parse(response.data);
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getFilesByDenunciaId(
    denunciaId: number,
  ): Promise<string[]> {
    try {
      const response = await api.get<string[]>(
        `/denuncia/arquivos/gerenciador/uploads/${denunciaId}`,
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
    status: string,
    secretaria: number,
  ): Promise<NumeroDeDenunciasPorBairro[]> {
    try {
      const response = await api.get(
        '/denuncia/gerenciador/contador-denuncias-bairro',
        {
          params: {
            status,
            secretaria,
          },
          responseType: 'json',
        },
      );

      return JSON.parse(response.data) as NumeroDeDenunciasPorBairro[];
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

  public static async indeferirDenuncia(data: {
    denunciaId: number;
    motivo: string;
  }): Promise<void> {
    try {
      await api.put('/denuncia/denuncias/indeferir', data);
    } catch (error) {
      console.error(`Falha ao indeferir denúncia ${data.denunciaId}:`, error);
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getDenunciaPorBairro(data: {
    status: string;
    secretaria: number;
    bairro: string;
    'tipo-denuncia': string;
  }): Promise<DenunciaInMap[]> {
    try {
      const response = await api.get(`/denuncia/gerenciador/filtro-denuncias`, {
        params: data,
        responseType: 'json',
      });

      if (response.status !== 200) {
        throw new Error('Não foi possível buscar as denúncias por bairro.');
      }

      return JSON.parse(response.data) as DenunciaInMap[];
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return [];
      }
      console.error('Erro ao buscar denúncias por bairro:', error);
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }
}
