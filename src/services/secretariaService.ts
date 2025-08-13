import { API_BASE_URL } from '../config/api';
import type { createSecretaria, Secretaria } from '../types/Secretaria'; // Ajuste o caminho conforme necessário

export async function getAllSecretarias(): Promise<Secretaria[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/secretaria/listar-todas`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível listar as secretarias.');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro ao buscar secretarias. Tente novamente mais tarde.');
  }
}

//funções sem fetch
export async function getSecretariaById(id: number): Promise<Secretaria> {
  alert(`id da secretaria: ${id}`);

  try {
    // Simulando resposta de teste:
    const response: Secretaria = {
      id,
      nome: 'Secretaria Teste',
      sigla: 'TEST',
      ativo: true,
      visivel: true,
    };

    return response;
  } catch (error) {
    throw new Error('Erro ao buscar secretaria. Tente novamente mais tarde.');
  }
}

export async function deleteSecretaria(id: number): Promise<void> {
  alert(`id da secretaria:  ${id} tem certeza que deseja deletar?`);
  try {
    const response = await fetch(`${API_BASE_URL}/secretaria/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Não foi possível deletar a secretaria.');
    }
  } catch (error) {
    throw new Error('Erro ao deletar secretaria. Tente novamente mais tarde.');
  }
}
export async function updateSecretaria(id: number): Promise<Secretaria> {
  alert(`id da secretaria:  ${id} tem certeza que deseja atualizar?`);
  try {
    const response = await fetch(`${API_BASE_URL}/secretaria/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Não foi possível atualizar a secretaria.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Erro ao atualizar secretaria. Tente novamente mais tarde.',
    );
  }
}

export async function uploadSecretaria(
  secretaria: createSecretaria,
): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/secretaria/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(secretaria),
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      if (contentType?.includes('application/json')) {
        const errorJson = await response.json();
        throw new Error(
          errorJson.message || 'Erro ao cadastrar serviço externo.',
        );
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar serviço externo.');
      }
    }

    if (contentType?.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text };
    }
  } catch (error: any) {
    throw new Error(
      error.message || 'Erro desconhecido ao cadastrar serviço externo.',
    );
  }
}

export default {
  getAllSecretarias,
  uploadSecretaria,
  updateSecretaria,
  deleteSecretaria,
  getSecretariaById,
};
