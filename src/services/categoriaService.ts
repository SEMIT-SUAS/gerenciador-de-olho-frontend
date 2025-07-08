import { API_BASE_URL } from '../config/api'

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

export default {
  getAll,
}
