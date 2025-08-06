import type { BannerModel } from '../types/Banner';
import { API_BASE_URL } from '../config/api';
import { getAPIFileURL } from '@/utils/getAPIFileURL';

async function getAll(): Promise<BannerModel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/listar-ativos`, {
      method: 'GET',
    });

    if (response.status != 200) {
      throw new Error('Não foi possível listar os banners.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function upload(formData: FormData): Promise<BannerModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/cadastrar`, {
      method: 'POST',
      body: formData,
    });

    if (response.status != 201) {
      throw new Error('Não foi possível criar o banner.');
    }

    const newBanner: BannerModel = await response.json();
    newBanner.imagem = getAPIFileURL(newBanner.imagem);

    return newBanner;
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function toggleVisibility(
  bannerId: number,
  visible: boolean,
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/banner/atualizar/visibilidade`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bannerId,
          visivel: visible,
        }),
      },
    );

    if (response.status !== 200) {
      throw new Error('Não foi possível alterar a visibilidade do banner.');
    }
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function trash(bannerId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/atualizar/atividade`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: bannerId,
        ativo: false,
      }),
    });

    if (response.status !== 200) {
      throw new Error('Não foi possível deletar esse banner.');
    }
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function update(formData: FormData): Promise<BannerModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/atualizar`, {
      method: 'PUT',
      body: formData,
    });

    if (response.status !== 200) {
      throw new Error('Não foi possível atualizar o banner.');
    }

    const data = await response.json();
    data.imagem = getAPIFileURL(data.imagem);

    return data;
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

export default {
  getAll,
  upload,
  toggleVisibility,
  trash,
  update,
};
