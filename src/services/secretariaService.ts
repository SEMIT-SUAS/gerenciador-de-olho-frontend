import type { SecretariaModel } from '../types/Secretaria';
import { API_BASE_URL } from '../config/api';

export async function getAll(): Promise<SecretariaModel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/secretaria/listar-todas`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível listar as secretarias.');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro ao buscar secretarias. Tente novamente mais tarde.');
  }
}

export default {
  getAll,
};
