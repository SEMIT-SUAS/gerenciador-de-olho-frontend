import type { Persona } from '../types/Persona';
import { API_BASE_URL } from '../config/api';

export async function getAllPerosona(): Promise<Persona[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/persona-servico/listar-ativos`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Não foi possível listar os serviços.')
    }

    return await response.json()
  } catch (error) {
    throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
  }
}