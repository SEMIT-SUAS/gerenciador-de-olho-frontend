import type { Banners } from '../types/Banners'
import { API_BASE_URL } from '../config/api'

async function getAllBanners(): Promise<Banners[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/banners/listar`, {
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

async function getVisibleBanners(): Promise<Banners[]>{
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

async function getBannerById(id: number): Promise<Banners[]> {
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

async function uploadBanner(formData: FormData): Promise<Banners> {
    try {
        const response = await fetch(`${API_BASE_URL}/banners/upload`,{
            method:'POST',
            body: formData
        })

        if (!response.ok){
            throw new Error('Não foi possível fazer enviar banner')
        }

        return await response.json()
    } catch(error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }
}

async function updateBanner(id: number, formData: FormData): Promise<Banners> {
    try {
        const response = await fetch(`${API_BASE_URL}/banners/atualizar/${id}`, {
            method: 'PUT',
            body: formData,
        })

        if (!response.ok){
            throw new Error('Não foi possível atualizar banner')
        }

        return await response.json()
    } catch(error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }    
}

async function changeBannerVisibility(id: number, isVisible: boolean): Promise<Banners> {
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

async function deleteBanner(id: number): Promise<void> {
    try{
        const response = await fetch(`${API_BASE_URL}/banners/deletar/${id}`, {
            method: 'DELETE'
        })
        
        if (!response.ok){
            throw new Error('Não foi foi possível excluir Banner')
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
  deleteBanner,
}