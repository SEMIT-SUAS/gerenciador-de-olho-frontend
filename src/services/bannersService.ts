import type { BannerModel } from '../types/Banner';
import { API_BASE_URL } from '../config/api';

async function getAll(): Promise<BannerModel[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/banner/listar-visiveis-ativos`,
      {
        method: 'GET',
      },
    );

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

    return await response.json();
  } catch (error) {
    console.log(error);
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

export default {
  getAll,
  upload,
};
