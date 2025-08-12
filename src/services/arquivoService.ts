import { BASE_API_URL } from '@/constants/baseApiURL';
import type { DenunciaFile } from '@/types/DenunciaFile';

async function getFilesByDenunciaId(
  idDenuncia: number,
): Promise<DenunciaFile[]> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/denuncia/arquivos/uploads/${idDenuncia}`,
      { method: 'GET' },
    );

    if (!response.ok) {
      throw new Error('Não foi possível encontrar os arquivos da denúncia.');
    }

    // A resposta já contém a lista de arquivos com suas URLs
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar arquivos da denúncia ${idDenuncia}:`, error);
    // Retorna um array vazio em caso de erro para não quebrar o fluxo
    return [];
  }
}

export default {
  getFilesByDenunciaId,
};
