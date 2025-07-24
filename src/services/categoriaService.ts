import { API_BASE_URL } from '../config/api'
import type { Categoria } from '../types/CategoriaDenuncia'

async function getAll() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`)
    const body = await response.json()

    if (response.status != 200) {
      throw new Error(body.error)
    }

    return body
  } catch {
    throw new Error('Serviço de listagem de categorias indisponível, tente novamente mais tarde')
  }
}

async function getCategoriaById(id: number): Promise<Categoria> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`)
    const body = await response.json()

    if (response.status != 200) {
      throw new Error('Não foi possível encontrar a categoria.')
    }

    return body
  } catch {
    throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
  }
}

export default {
  getAll,
  getCategoriaById,
}