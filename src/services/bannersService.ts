import type { BannerModel } from '../types/Banner';
import { API_BASE_URL } from '../config/api';

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
    const imagePath = newBanner.imagem;
    const fileName = imagePath.split('/').pop() || imagePath;
    newBanner.imagem = `${API_BASE_URL}/arquivo/upload/banners/${fileName}`;

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });

    if (response.status !== 200) {
      throw new Error('Não foi possível atualizar o banner.');
    }

    return await response.json();
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
