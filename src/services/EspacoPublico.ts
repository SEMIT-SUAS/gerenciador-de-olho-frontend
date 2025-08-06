import type { CreateEspacoPublico, EspacoPublicoById } from '../types/EspacoPublico'
import { API_BASE_URL } from '../config/api'

export async function uploadEspacoPublico(formData: FormData): Promise<any> {
    try{
        const response = await fetch(`${API_BASE_URL}/espaco-publico/cadastrar`, {
            method: 'POST',
            body: formData,});

        const contentType = response.headers.get("content-type");

    if (!response.ok) {
      // Tenta extrair mensagem de erro, se possível
      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        throw new Error(errorJson.message || "Erro ao cadastrar banner.");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao cadastrar banner.");
      }
    }

    // Se for JSON
    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      // Se for texto (caso do seu backend agora)
      const text = await response.text();
      return { message: text };
    }
  } catch (error: any) {
    throw new Error(error.message || "Erro desconhecido ao cadastrar banner.");
  }
}

export async function getAllEspacoPublico(): Promise<EspacoPublicoById[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/espaco-publico/listar-ativos`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Não foi possível listar os Banners.')
    }

    return await response.json()
  } catch (error) {
    throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
  }
}

export async function getEspacoPublicoById(id: number): Promise<EspacoPublicoById> {
  try {
    const response = await fetch(`${API_BASE_URL}/espaco-publico/buscar/${id}`);

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        throw new Error(errorJson.message || "Erro ao buscar espaço público.");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao buscar espaço público.");
      }
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Erro desconhecido ao buscar espaço público.");
  }
}

export async function updateEspacoPublico(formData: FormData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/espaco-publico/atualizar`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao atualizar espaço público");
  }
}

export async function changeEspacoPublicoVisibility(id:number, visivel: boolean): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/espaco-publico/atualizar/visibilidade`, {
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

export async function changeEspacoPublicoAtivo(id:number, ativo: boolean): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/espaco-publico/atualizar/atividade`, {
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