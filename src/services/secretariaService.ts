import type { SecretariaModel } from '../types/Secretaria';
import { api } from '@/lib/axios';

export class SecretariaService {
  private static SERVICE_UNAVAILABLE_ERROR = new Error(
    'Serviço de secretaria indisponível. Tente novamente mais tarde.',
  );

  public static async getAll(): Promise<SecretariaModel[]> {
    try {
      const response = await api.get('/secretaria/listar-todas', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status != 200) {
        throw new Error('Não foi possível buscar as secretarias.');
      }

      return JSON.parse(response.data);
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }
}
