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
        const response = await fetch(`${API_BASE_URL}/servico/atualizar/${servico.id!}`, {
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

export async function changeServiceVisibility(id: number, visivel: boolean): Promise<Services>{
    try {
        const response = await fetch(`${API_BASE_URL}/atualizar/visibilidade`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, visivel }),
    });

    if (!response.ok){
        throw new Error('Não foi possível alterar visibilidade do serviço')
    }
    return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }
}

export async function changeServiceAtivo(id: number, ativo: boolean): Promise<Services> {
    try{
        const response = await fetch(`${API_BASE_URL}/atualizar/atividade`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ativo }),
        });

        if (!response.ok){
            throw new Error('Não foi possivel alterar a opção "ativo"')
        }
        return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }
}

export async function deleteService(id: number): Promise<void> {
    try{
        const response = await fetch(`${API_BASE_URL}/servico/deletar/${id}`, { 
        method: 'DELETE', 
    });

    if (!response.ok){
        throw new Error('Não foi possível apagar serviço')
    }
    return await response.json()
    } catch (error){
        throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
    }
}

export default {
  getAllServices,
  getVisibleServicos,
  getServicoById,
  deleteService,
  changeServiceVisibility,
  createService,
  updateServico,
  changeServiceAtivo,
}