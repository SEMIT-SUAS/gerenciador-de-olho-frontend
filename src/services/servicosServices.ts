import type { Services } from '../types/Services';
import { API_BASE_URL } from '../config/api';

export async function getAllServices(): Promise<Services[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico/listar-ativos`, {
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

export async function createService(servico: Services): Promise<Services> {
    try {
        const response = await fetch(`${API_BASE_URL}/servico/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(servico),
        })

        if (!response.ok){
            throw new Error('Não foi possível salvar serviço')
        }
        return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }    
}

export async function updateServico(servico: Services): Promise<Services> {
    try {
        const response = await fetch(`${API_BASE_URL}/servico/atualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(servico),
        })
        
        if (!response.ok) {
            throw new Error('Não foi possível atualizar serviço')
        }
        return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }    
}

export async function getVisibleServicos(): Promise<Services[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/servico/visiveis`, {
            method: 'GET',
        })

        if (!response.ok) {
            throw new Error('Não foi possível buscar serviços visiveis')
        }
        return await response.json()
    } catch (error) {
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }
}

export async function getServicoById(id: number): Promise<Services> {
    try {
        const response = await fetch(`${API_BASE_URL}/servico/buscar/${id}`, {
            method: 'GET',
        });
        
        if (!response.ok){
            throw new Error('Não foi possível buscar serviço')
        }
        return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }    
}

export async function changeServiceVisibility(id: number, visivel: boolean): Promise<Services | { message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico/atualizar/visibilidade`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, visivel }),
    });

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

export async function changeServiceAtivo(id: number, ativo: boolean): Promise<Services | { message: string }> {
    try{
        const response = await fetch(`${API_BASE_URL}/servico/atualizar/atividade`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ativo }),
        });

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

export default {
  getAllServices,
  getVisibleServicos,
  getServicoById,
  changeServiceVisibility,
  createService,
  updateServico,
  changeServiceAtivo,
}