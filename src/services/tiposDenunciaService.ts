import { API_BASE_URL } from '@/config/api';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import type { FormMethod } from 'react-router-dom';

async function getAllTiposDenuncia(): Promise<TipoDenunciaModel[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tipo-denuncia/listar-ativos`,
      {
        method: 'GET',
      },
    );

    if (!response.ok) {
      throw new Error('Não foi possível listar os tipos de denúncia.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function createTipoDenuncia(
  formData: FormData,
): Promise<TipoDenunciaModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/tipo-denuncia/cadastrar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Não foi possível criar denúncia.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function changeTipoAtivo(
  id: number,
  ativo: boolean,
): Promise<TipoDenunciaModel> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tipo-denuncia/atualizar/atividade`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ativo }),
      },
    );

    if (!response.ok) {
      throw new Error('Não foi possível apagar o tipo de denúncia.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function changeTipoVisibility(
  id: number,
  visivel: boolean,
): Promise<TipoDenunciaModel> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tipo-denuncia/atualizar/visibilidade`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, visivel }),
      },
    );

    if (!response.ok) {
      throw new Error('Não foi possível apagar o tipo de denúncia.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamnete mais tarde',
    );
  }
}

async function updateTipoDenuncia(formData:FormData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tipo-denuncia/atualizar`,
      {
        method: 'PUT',
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error('Não foi possível apagar o tipo de denúncia.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamnete mais tarde',
    );
  }
}

export default {
  getAllTiposDenuncia,
  changeTipoAtivo,
  changeTipoVisibility,
  createTipoDenuncia,
  updateTipoDenuncia
};
