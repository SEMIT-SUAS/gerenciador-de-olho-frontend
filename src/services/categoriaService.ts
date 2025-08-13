import { api } from '@/lib/axios';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';

export class CategoriaService {
  private static SERVICE_UNAVAILABLE_ERROR = new Error(
    'Serviço de categoria indisponível. Tente novamente mais tarde.',
  );

  public static async getAllTipos(): Promise<TipoDenunciaModel[]> {
    try {
      const response = await api.get('tipo-denuncia/listar-ativos', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status != 200) {
        throw new Error('Não foi possível buscar os tipos de denúncia.');
      }

      return JSON.parse(response.data);
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }
}
