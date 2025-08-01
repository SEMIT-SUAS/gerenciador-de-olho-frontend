import type { ServiceExterno } from '../types/ServicoExterno';
import { API_BASE_URL } from '../config/api';

// src/services/servicosExternosService.ts
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

export async function changeServiceVisibility(id: number, visivel: boolean): Promise<ServiceExterno | { message: string }> {
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
      return { message: text };
    }
  } catch (error: any) {
    console.error("Erro no catch do changeServiceVisibility:", error);
    throw new Error(error.message || "Erro desconhecido ao alterar visibilidade do serviço.");
  }
}

export async function changeServiceAtivo(id: number, ativo: boolean): Promise<ServiceExterno | { message: string }> {
    try{
        const response = await fetch(`${API_BASE_URL}/servico-externo/atualizar/atividade`, {
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