import type { Portais } from '../types/Portais'
import { API_BASE_URL } from '../config/api'

async function getAllPortais(): Promise<Portais[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/portais/listar`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Não foi possível listar os portal.')
    }

    return await response.json()
  } catch (error) {
    throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
  }
}

async function getVisiblePortais(): Promise<Portais[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/portais/visiveis`, {
            method: 'GET',
        })

        if (!response.ok) {
            throw new Error('Não foi possível buscar portais visiveis')
        }
        return await response.json()
    } catch (error) {
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }
}

async function getPortalById(id: number): Promise<Portais> {
    try{
        const response = await fetch(`${API_BASE_URL}/portais/buscar/${id}`,{
        method: 'GET',
    })

    if (!response.ok) {
        throw new Error('Não foi possível buscar portais')
    }
    return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }    
}

async function createPortal(portal: Portais): Promise<Portais> {
    try{
        const response = await fetch(`${API_BASE_URL}/portais/criar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(portal),
    })

    if (!response.ok){
        throw new Error('Não foi possível criar portal ')
    }
    return await response.json()
    
    } catch(error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }
}

async function updatePortal(id: number, portais: Partial<Portais>): Promise<Portais> {
    try {
        const response = await fetch(`${API_BASE_URL}/portais/atualizar/${id}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(portais),
        })

        if (!response.ok){
            throw new Error('Não foi possível atualizar portal')
        }
        return await response.json()
        
    } catch(error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }    
}

async function changePortalVisibility(id: number, isVisible: boolean): Promise<Portais> {
    try {
        const response = await fetch(`${API_BASE_URL}/portais/visibilidade/${id}?isVisible=${isVisible}`, {
            method: 'PUT',
        });

        if (!response.ok){
            throw new Error('Não foi possível alterar visibildiade do portal')
        }
        return await response.json()

    } catch(error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }    
}

async function deletePortal(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/portais/deletar/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok){
            throw new Error('Não foi possível deletar portal')
        }
        return await response.json()
    } catch(error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }    
}

export default {
  getAllPortais,
  getVisiblePortais,
  getPortalById,
  createPortal,
  updatePortal,
  changePortalVisibility,
  deletePortal,
}