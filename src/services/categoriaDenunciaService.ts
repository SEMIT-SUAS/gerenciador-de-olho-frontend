import { API_BASE_URL } from '../config/api'
import type { GetCategoriaDenuncia, FormCategoriaDenuncia } from '../types/CategoriaDenuncia'

// categoriaDenunciaService.ts
export async function createCategoriaDenuncia(data: FormData) {
  const response = await fetch(`${API_BASE_URL}/categoria-denuncia/cadastrar`, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Erro ao criar categoria');
  }

  return response.json();
}

export async function getAll() {
  try {
    const response = await fetch(`${API_BASE_URL}/categoria-denuncia/listar-ativos`)
    const body = await response.json()

    if (response.status != 200) {
      throw new Error(body.error)
    }

    return body
  } catch {
    throw new Error('Serviço de listagem de categorias indisponível, tente novamente mais tarde')
  }
}

export async function getCategoriaById(id: number): Promise<GetCategoriaDenuncia> {
  try {
    const response = await fetch(`${API_BASE_URL}/categoria/${id}`)
    const body = await response.json()

    if (response.status != 200) {
      throw new Error('Não foi possível encontrar a categoria.')
    }

    return body
  } catch {
    throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
  }
}

export async function changeCategoriaDenunciaVisibility(id: number, visivel: boolean): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/categoria-denuncia/atualizar/visibilidade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, visivel }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao alterar status de visibilidade: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro na requisição changeServiceVisibility:', error);
    throw error;
  }
}

export async function changeCategoriaDenunciaAtivo(id: number, ativo: boolean) {
  try {
    const response = await fetch(`${API_BASE_URL}/categoria-denuncia/atualizar/atividade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ativo }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao alterar status de visibilidade: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro na requisição changeServiceVisibility:', error);
    throw error;
  }
}

export async function updateCategoriaDenuncia(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/categoria-denuncia/atualizar`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao atualizar espaço público");
  }
  
}
