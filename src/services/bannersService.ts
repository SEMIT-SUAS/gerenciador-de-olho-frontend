import type { Banner } from '../types/Banners'
import { API_BASE_URL } from '../config/api'

export async function getAllBanners(): Promise<Banner[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/listar-visiveis-ativos`, {
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

export async function uploadBanner(formData: FormData): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/cadastrar`, {
      method: 'POST',
      body: formData,
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

async function getVisibleBanners(): Promise<Banner[]>{
    try {
        const response = await fetch(`${API_BASE_URL}/banners/visiveis`, {
            method:'GET',
        })

        if(!response.ok){
            throw new Error('Não foi possível listar os Banners visiveis.')
        }

        return await response.json()
    } catch(error){
            throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')    
    }
}

async function getBannerById(id: number): Promise<Banner[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/banners/buscar/${id}`, {
            method:'GET',
        })

        if (!response.ok){
            throw new Error('Não foi possível listar os Banner')
        }

        return await response.json()
    } catch(error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }    
}

export async function updateBanner(id: number, formData: FormData): Promise<Banner> {
  try {
    formData.append("id", id.toString());

    const response = await fetch(`${API_BASE_URL}/banners/atualizar`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro ao atualizar: ${text}`);
    }

    return await response.json(); // se o back retornar JSON
  } catch (error: any) {
    throw new Error(
      error.message || "Infelizmente ocorreu um erro no servidor."
    );
  }
}

async function changeBannerVisibility(id: number, isVisible: boolean): Promise<Banner> {
    try {
        const response = await fetch(`${API_BASE_URL}/banners/visibilidade/${id}?isVisible=${isVisible}`, {
            method: 'PUT'
        })

        if (!response.ok){
            throw new Error('Não foi possível trocar visibilidade do Banner')
        }

        return await response.json()
    } catch(error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }    
}

export default {
  getAllBanners,
  getVisibleBanners,
  getBannerById,
  uploadBanner,
  updateBanner,
  changeBannerVisibility,
}