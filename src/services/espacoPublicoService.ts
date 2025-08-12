import { BASE_API_URL } from '@/constants/baseApiURL';
import type { EspacoPublicoModel } from '@/types/EspacoPublico';

async function create(formData: FormData): Promise<void> {
  try {
    const response = await fetch(`${BASE_API_URL}/espaco-publico/cadastrar`, {
      method: 'POST',
      body: formData,
    });

    if (response.status != 201) {
      throw new Error(
        `Não foi possível buscar os espaços públicos. Tente novamente mais tarde.`,
      );
    }
  } catch (error) {
    throw new Error(
      'Serviço indisponível no momento. Tente novamente mais tarde.',
    );
  }
}

async function get(espacoPublicoId: number): Promise<EspacoPublicoModel> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/espaco-publico/buscar/${espacoPublicoId}`,
      {
        method: 'GET',
      },
    );

    if (response.status != 200) {
      throw new Error(
        `Não foi possível buscar esse espaço público. Tente novamente mais tarde.`,
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Serviço indisponível no momento. Tente novamente mais tarde.',
    );
  }
}

async function getAll(): Promise<EspacoPublicoModel[]> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/espaco-publico/listar-ativos`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status != 200) {
      throw new Error(
        `Não foi possível buscar os espaços públicos. Tente novamente mais tarde.`,
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Serviço indisponível no momento. Tente novamente mais tarde.',
    );
  }
}

async function toggleVisibility(id: number, visivel: boolean): Promise<void> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/espaco-publico/atualizar/visibilidade`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, visivel }),
      },
    );

    if (response.status != 200) {
      throw new Error(
        `Não foi possível alterar a visibilidade do espaço público. Tente novamente mais tarde.`,
      );
    }
  } catch (error) {
    throw new Error(
      'Serviço indisponível no momento. Tente novamente mais tarde.',
    );
  }
}

async function trash(id: number): Promise<void> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/espaco-publico/atualizar/atividade`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ativo: false }),
      },
    );

    if (response.status != 200) {
      throw new Error(
        `Não foi possível excluir o espaço público. Tente novamente mais tarde.`,
      );
    }
  } catch (error) {
    throw new Error(
      'Serviço indisponível no momento. Tente novamente mais tarde.',
    );
  }
}

export default {
  create,
  getAll,
  toggleVisibility,
  trash,
  get,
};
