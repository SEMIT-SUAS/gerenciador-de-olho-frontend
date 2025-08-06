import type { Servicos } from '../types/Servicos';
import { API_BASE_URL } from '../config/api';

export async function getAllServices(): Promise<ServicosListar[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico/listar-ativos`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível listar os serviços.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

export async function createService(servico: Servicos): Promise<Servicos> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servico),
    });

    if (!response.ok) {
      throw new Error('Não foi possível salvar serviço');
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente',
    );
  }
}

export async function updateServico(servico: Servicos): Promise<Servicos> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico/atualizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servico),
    });

    if (!response.ok) {
      throw new Error('Não foi possível atualizar serviço');
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente',
    );
  }
}

export async function getVisibleServicos(): Promise<Servicos[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico/visiveis`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível buscar serviços visiveis');
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

export async function getServicoById(id: number): Promise<Servicos> {
  try {
    const response = await fetch(`${API_BASE_URL}/servico/buscar/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível buscar serviço');
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente',
    );
  }
}

export async function changeServiceVisibility(
  id: number,
  visivel: boolean,
): Promise<Servicos> {
  try {
    const response = await fetch(`${API_BASE_URL}/atualizar/visibilidade`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, visivel }),
    });

    if (!response.ok) {
      throw new Error('Não foi possível alterar visibilidade do serviço');
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente',
    );
  }
}

export async function changeServiceAtivo(
  id: number,
  ativo: boolean,
): Promise<Servicos> {
  try {
    const response = await fetch(`${API_BASE_URL}/atualizar/atividade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ativo }),
    });

    if (!response.ok) {
      throw new Error('Não foi possivel alterar a opção "ativo"');
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente',
    );
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
};
