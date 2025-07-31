import type { Banner } from '../types/Banner';
import { API_BASE_URL } from '../config/api';

async function getAllBanner(): Promise<Banner[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/listar`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível listar os Banner.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function getVisibleBanner(): Promise<Banner[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/visiveis`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível listar os Banner visiveis.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function getBannerById(id: number): Promise<Banner[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/buscar/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível listar os Banner');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function uploadBanner(formData: FormData): Promise<Banner> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Não foi possível fazer enviar banner');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function updateBanner(id: number, formData: FormData): Promise<Banner> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/atualizar/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Não foi possível atualizar banner');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function changeBannerVisibility(
  id: number,
  isVisible: boolean,
): Promise<Banner> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/banner/visibilidade/${id}?isVisible=${isVisible}`,
      {
        method: 'PUT',
      },
    );

    if (!response.ok) {
      throw new Error('Não foi possível trocar visibilidade do Banner');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function deleteBanner(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/deletar/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Não foi foi possível excluir Banner');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

export default {
  getAllBanner,
  getVisibleBanner,
  getBannerById,
  uploadBanner,
  updateBanner,
  changeBannerVisibility,
  deleteBanner,
};
