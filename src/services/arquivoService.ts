import { api } from '@/lib/axios';

export class ArquivoService {
  static async getBlobByURL(url: string) {
    try {
      const response = await api.request({
        url,
        method: 'GET',
        responseType: 'blob',
      });

      if (response.status != 200) {
        throw new Error('Não foi possível buscar por esse arquivo');
      }

      return response.data as Blob;
    } catch (error) {
      throw new Error(
        'Serviço de arquivo fora do ar. Tente novamente mais tarde',
      );
    }
  }
}
