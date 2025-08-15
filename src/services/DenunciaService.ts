import { api } from '@/lib/axios.ts';
import type {
  DenunciaBasicInfoModel,
  DenunciaModel,
} from '../types/Denuncia.ts';

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
          responseType: "json"
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
      const response = await api.get(
        '/denuncia/arquivos/gerenciador/uploads/' + denunciaId,
        {
          responseType: "json"
        },
      );

      if (response.status != 200) {
        throw new Error('Não foi possível buscar os arquivos dessa denúncia.');
      }

      return JSON.parse(response.data);
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async desvincularAcao(denunciaId: number): Promise<void> {
    try {
      const response = await api.patch(
        '/denuncia/denuncias/desvincular-acao/' + denunciaId,
      );

      if (response.status != 200) {
        throw new Error('Não foi possível desvincular a ação da denúncia.');
      }
    } catch (error) {
      console.error(error);
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async indeferirDenuncia(data: { denunciaId: number, motivo: string }): Promise<void> {
    try {
      const response = await api.put(
        '/denuncia/denuncias/indeferir',
        data
      );

      if (response.status != 200) {
        throw new Error('Não foi possível indeferir a denúncia.');
      }
    } catch (error) {
      console.error(error);
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

}