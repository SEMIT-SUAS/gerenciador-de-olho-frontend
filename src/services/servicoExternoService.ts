import type { ServiceExterno } from '../types/ServicoExterno';
import { API_BASE_URL } from '../config/api';

export async function uploadServicoExterno(formData: FormData): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico-externo/cadastrar`, {
      method: 'POST',
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        throw new Error(errorJson.message || "Erro ao cadastrar serviço externo.");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao cadastrar serviço externo.");
      }
    }

    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text };
    }
  } catch (error: any) {
    throw new Error(error.message || "Erro desconhecido ao cadastrar serviço externo.");
  }
}

export async function getAllServicoExterno(): Promise<ServiceExterno[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico-externo/listar-ativos`, {
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

export async function getServicoExternoById(id: number): Promise<ServiceExterno> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico-externo/buscar/${id}`);

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        throw new Error(errorJson.message || "Erro ao buscar servico externo.");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao buscar servico externo.");
      }
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Erro desconhecido ao buscar espaço público.");
  }
}

export async function changeServiceVisibility(id: number, visivel: boolean): Promise<ServiceExterno | { retorno: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico-externo/atualizar/visibilidade`, {
      method: 'PUT',
      headers: { 'Content-Type' : 'application/json',},
      body: JSON.stringify({ id, visivel }),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        console.error("Erro da API:", errorJson);
        throw new Error(errorJson.message || "Erro ao alterar visibilidade do serviço.");
      } else {
        const errorText = await response.text();
        console.error("Erro da API (texto):", errorText);
        throw new Error(errorText || "Erro ao alterar visibilidade do serviço.");
      }
    }

    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { retorno: text };
    }
  } catch (error: any) {
    console.error("Erro no catch do changeServiceVisibility:", error);
    throw new Error(error.message || "Erro desconhecido ao alterar visibilidade do serviço.");
  }
}

export async function changeServiceExternoAtivo(id: number, ativo: boolean): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico-externo/atualizar/atividade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ativo }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao alterar status de visibilidade: ${response.status} - ${response.statusText}`);
    }

    const mensagem = await response.text();
    return mensagem;
  } catch (error) {
    console.error('Erro na requisição changeServiceExternoAtivo:', error);
    throw error;
  }
}

export async function updateServicoExterno(formData: FormData): Promise<void | { retorno: string; }> {
  try {
  const response = await fetch(`${API_BASE_URL}/servico-externo/atualizar`, {
    method: 'PUT',
    body: formData,
  });

  const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        console.error("Erro da API:", errorJson);
        throw new Error(errorJson.message || "Erro ao alterar visibilidade do serviço.");
      } else {
        const errorText = await response.text();
        console.error("Erro da API (texto):", errorText);
        throw new Error(errorText || "Erro ao alterar visibilidade do serviço.");
      }
    }

    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { retorno: text };
    }
  } catch (error: any) {
    console.error("Erro no catch do changeServiceVisibility:", error);
    throw new Error(error.message || "Erro desconhecido ao alterar visibilidade do serviço.");
  }
}