import type { Projetos } from '../types/Projetos';
import { API_BASE_URL } from '../config/api';

export async function getAllProjetos(): Promise<Projetos[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projetos/listar`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Não foi possível listar os Projetos.')
    }

    return await response.json()
  } catch (error) {
    throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
  }
}

export async function getProjetosVisiveis(): Promise<Projetos[]> {
    try{
        const response = await fetch(`${API_BASE_URL}/projetos/visiveis`, {
            method:'GET',
        });
        
        if (!response.ok){
            throw new Error('Não foi possível listar os visiveis')
        }
        return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
    }
}

export async function getProjetoById(id: number): Promise<Projetos> {
    try{
        const response = await fetch(`${API_BASE_URL}/projetos/buscar/${id}`, {
            method: 'GET',
        });
        
        if (!response.ok){
            throw new Error('Não foi possível buscar projeto')
        }
        return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }    
}

export async function uploadProjeto(formData: FormData): Promise<{ status: number; message: string; data: Projetos }> {
    try{
        const response = await fetch(`${API_BASE_URL}/projetos/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok){
            throw new Error('Não foi possível enviar o projeto')
        }
        return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }    
}

export async function updateProjeto(id: number, formData: FormData): Promise<Projetos> {
  try {
    const response = await fetch(`${API_BASE_URL}/projetos/atualizar/${id}`, {
      method: 'PUT',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Não foi possível atualizar o projeto')
    }

    return await response.json()
  } catch (error) {
    throw new Error('Erro no servidor. Tente novamente mais tarde.')
  }
}

export async function changeProjetoVisibility(id: number, isVisible: boolean): Promise<Projetos>{
    try{
        const response = await fetch(`${API_BASE_URL}/projetos/visibilidade/${id}?isVisible=${isVisible}`, {
        method: 'PUT',
    });

    if (!response.ok){
        throw new Error('Não foi possível alterar visibilidade do projeto')
    }
    return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }
}

export default {
  getAllProjetos,
  getProjetosVisiveis,
  getProjetoById,
  uploadProjeto,
  updateProjeto,
  changeProjetoVisibility,
};