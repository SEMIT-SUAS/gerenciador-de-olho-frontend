import { api } from '@/lib/axios';
import type { Bairro, NumeroDeDenunciasPorBairro } from '@/types/Bairro.ts';

export class DenunciaService {
  async getAllBairros(): Promise<Bairro[]> {
    return [];
  }

  async getNumberDenunciasInMap(
    status: string,
    secretaria: number,
  ): Promise<NumeroDeDenunciasPorBairro[]> {
    try {
      const response = await api.get(
        `/denuncia/gerenciador/contador-denuncias-bairro?status=${status}&secretaria=${secretaria}`,
        {
          responseType: 'json',
        },
      );

      return JSON.parse(response.data) as NumeroDeDenunciasPorBairro[];
    } catch (error) {
      console.error('Falha ao buscar o número de denúncias no mapa:', error);

      throw error;
    }
  }
}

export default {};
