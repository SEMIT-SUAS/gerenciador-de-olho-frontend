import { API_BASE_URL } from '@/config/api';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { getAPIFileURL } from '@/utils/getAPIFileURL';
import { BaseServiceClass } from './BaseServiceClass';
import type { DenunciaModel, DenunciaStatusModelTypes } from '@/types/Denuncia';

export class CategoriaDenunciaService extends BaseServiceClass {
  protected readonly serviceUnavailableError = new Error(
    'Serviço de categorias de denúncia indisponível. Tente novamente em instantes',
  );

  protected readonly notFoundError = new Error('Categoria de denúncia não encontrada.');
  protected readonly createError = new Error('Não foi possível criar a categoria de denúncia.');
  protected readonly updateError = new Error('Não foi possível atualizar a categoria de denúncia.');
  protected readonly visibilityError = new Error('Não foi possível alterar a visibilidade da categoria de denúncia.');
  protected readonly deleteError = new Error('Não foi possível deletar essa categoria de denúncia.');
  protected readonly serverError = new Error('Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde');

  async getAllByBairro(bairroId: number, status: DenunciaStatusModelTypes): Promise<DenunciaModel[]> {
    return []
  }
}

export class BannerService extends BaseServiceClass {
  public async getAll(): Promise<BannerModel[]> {
    try {
      const response = await api.get('/banner/listar-ativos', {
        responseType: "json"
      });

      if (response.status === 404) {
        throw this.notFoundError;
      }

      if (response.status !== 200) {
        throw new Error("Ocorreu um erro na busca desse Banner");
      }

      return JSON.parse(response.data) as BannerModel[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw this.serviceUnavailableError;
    }
  }

  public async upload(formData: FormData): Promise<BannerModel> {
    try {
      const response = await api.post('/banner/cadastrar', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        responseType: "json"
      });

      if (response.status !== 201) {
        throw this.createError;
      }

      const newBanner: BannerModel = JSON.parse(response.data);
      newBanner.imagem = getAPIFileURL(newBanner.imagem);

      return newBanner;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw this.serverError;
    }
  }

  public async toggleVisibility(bannerId: number, visible: boolean): Promise<void> {
    try {
      const body = JSON.stringify({
        id: bannerId,
        visivel: visible,
      })

      const response = await api.put('/banner/atualizar/visibilidade', body, {
        headers: {
          "Content-Type": "application/json"
        },
        responseType: "json"
      });

      if (response.status !== 200) {
        throw this.visibilityError;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw this.serverError;
    }
  }

  public async trash(bannerId: number): Promise<void> {
    try {
      const body = JSON.stringify({
        id: bannerId,
        ativo: false,
      })

      const response = await api.put('/banner/atualizar/atividade', body, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (response.status !== 200) {
        throw this.deleteError;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw this.serverError;
    }
  }

  public async update(formData: FormData): Promise<BannerModel> {
    try {
      const response = await api.put('/banner/atualizar', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        responseType: "json"
      });

      if (response.status !== 200) {
        throw this.updateError;
      }

      const updatedBanner: BannerModel = JSON.parse(response.data);
      updatedBanner.imagem = getAPIFileURL(updatedBanner.imagem);

      return updatedBanner;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw this.serverError;
    }
  }
}

async function create(data: FormData): Promise<CategoriaDenunciaModel> {
  const response = await fetch(`${API_BASE_URL}/categoria-denuncia/cadastrar`, {
    method: 'POST',
    body: data,
  });

  if (response.status != 201) {
    throw new Error('Não foi possível criar uma categoria');
  }

  const body = await response.json();
  body.icone = getAPIFileURL(body.icone);

  return body;
}

async function getAll(): Promise<CategoriaDenunciaModel[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categoria-denuncia/listar-ativos`,
      {
        method: 'GET',
      },
    );

    if (response.status != 200) {
      throw new Error('Não foi possível listar as categorias');
    }

    return await response.json();
  } catch {
    throw new Error('Serviço indisponível');
  }
}

async function trash(categoryId: number): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categoria-denuncia/atualizar/atividade`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId, ativo: false }),
      },
    );

    if (response.status != 200) {
      throw new Error('Não foi possível deletar a categoria');
    }
  } catch {
    throw new Error('Serviço indisponível');
  }
}

async function update(data: FormData): Promise<CategoriaDenunciaModel> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categoria-denuncia/atualizar`,
      {
        method: 'PUT',
        body: data,
      },
    );

    if (response.status != 200) {
      throw new Error('Não foi possível editar essa categoria');
    }

    const body = await response.json();
    body.icone = getAPIFileURL(body.icone);

    return body;
  } catch {
    throw new Error('Serviço indisponível');
  }
}

async function toggleVisibility(categoryId: number, visibility: boolean) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categoria-denuncia/atualizar/visibilidade`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId, visivel: visibility }),
      },
    );

    if (response.status != 200) {
      throw new Error('Não foi possível alterar a visibilidade da categoria');
    }
  } catch {
    throw new Error('Serviço indisponível');
  }
}

export default {
  create,
  getAll,
  trash,
  update,
  toggleVisibility,
};
