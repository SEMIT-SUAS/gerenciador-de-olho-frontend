import { API_BASE_URL } from '@/config/api';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';

async function getAll(): Promise<CategoriaDenunciaModel[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categoria-denuncia/listar-ativos`,
      {
        method: 'GET',
      },
    );

    if (response.status != 200) {
      throw new Error('Não foi possível listar as categorias');
    }

    return await response.json();
  } catch {
    throw new Error('Serviço indisponível');
  }
}

async function getTipoById(tipoId: number) {
  // const allTipos = [
  // ...acessibilidadeTipos,
  // ...infraestruturaTipos,
  // ...meioAmbienteTipos,
  // ...saudePublicaTipos,
  // ...transitoETransporteTipos,
  // ];
  // return allTipos.find((tipo) => tipo.id === tipoId);
}

export default {
  getAll,
  getTipoById,
};
