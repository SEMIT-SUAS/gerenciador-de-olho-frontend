import type { CreatePortal, Portais } from "../types/Portais";
import { API_BASE_URL } from "../config/api";


export async function getAllPortais(): Promise<Portais[]> {
  try{
      const response = await fetch(`${API_BASE_URL}/portal/listar-ativos`, {
          method: 'GET',
      })

      if(!response.ok){
          throw new Error('Não foi possível listar os serviços.')
      }

      return await response.json()
  } catch (error){
      throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde')
  }    
}

export async function createPortal(portal: CreatePortal): Promise<Portais> {
  try {
    const response = await fetch(`${API_BASE_URL}/portal/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portal),
      })
      
    if (response.status != 201){
      throw new Error('Não foi possível salvar serviço')
    }
    
      return await response.json()
  } catch (error){
      throw new Error('Infelizmente ocorreu um erro no servidor. Tente novamente')
  }    
}

export async function toggleAtivo(id: number, ativo: boolean): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/portal/atualizar/atividade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ativo }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao alterar status ativo: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro na requisição toggleAtivo:', error);
    throw error;
  }
}

export async function changeServiceVisibility(id: number, visivel: boolean): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/portal/atualizar/visibilidade`, {
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

export async function updatePortal(portal: Portais): Promise<Portais> {
  try {
    const response = await fetch(`${API_BASE_URL}/portal/atualizar`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(portal)
    });

    console.log(response)

    if(!response.ok) {
      throw new Error(`Erro ao modificar o portal: ${response.status} - ${response.statusText}`)
    }

   return await response.json();

  } catch (error) {
    console.error('Erro na requisição updatePortal:', error);
    throw error;
  }
}

export default {
  getAllPortais,
  createPortal,
  changeServiceVisibility,
  toggleAtivo,
  updatePortal
}
