import { api } from '@/lib/axios';
export class ArquivoService {
  private static SERVICE_UNAVAILABLE_ERROR = new Error(
    'Serviço de arquivos indisponível. Tente novamente mais tarde.',
  );

  public static async getFileBlobByURL(url: string): Promise<Blob> {
    try {
      const response = await api.get(url, {
        responseType: 'blob',
      });

      if (response.status !== 200) {
        throw new Error('Não foi possível buscar esse arquivo.');
      }

      return response.data;
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }
}
