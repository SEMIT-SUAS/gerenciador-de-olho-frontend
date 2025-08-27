import type { BannerModel } from '../types/Banner';
import { getAPIFileURL } from '@/utils/getAPIFileURL';
import { BaseServiceClass } from './BaseServiceClass';
import { api } from '@/lib/axios';

export class BannerService extends BaseServiceClass {
  protected readonly serviceUnavailableError = new Error(
    'Serviço de banners indisponível. Tente novamente em instantes',
  );

  protected readonly notFoundError = new Error('Banner não encontrado.');
  protected readonly createError = new Error(
    'Não foi possível criar o banner.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar o banner.',
  );
  protected readonly visibilityError = new Error(
    'Não foi possível alterar a visibilidade do banner.',
  );
  protected readonly deleteError = new Error(
    'Não foi possível deletar esse banner.',
  );
  protected readonly serverError = new Error(
    'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
  );

  public async getAll(): Promise<BannerModel[]> {
    try {
      const response = await api.get('/banner/listar-ativos', {
        responseType: 'json',
      });

      if (response.status === 404) {
        throw this.notFoundError;
      }

      if (response.status !== 200) {
        throw new Error('Ocorreu um erro na busca desse Banner');
      }

      return response.data as BannerModel[];
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
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'json',
      });

      if (response.status !== 201) {
        throw this.createError;
      }

      const newBanner: BannerModel = response.data;
      newBanner.imagem = getAPIFileURL(newBanner.imagem);

      return newBanner;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw this.serverError;
    }
  }

  public async toggleVisibility(
    bannerId: number,
    visible: boolean,
  ): Promise<void> {
    try {
      const body = JSON.stringify({
        id: bannerId,
        visivel: visible,
      });

      const response = await api.put('/banner/atualizar/visibilidade', body, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json',
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
      });

      const response = await api.put('/banner/atualizar/atividade', body, {
        headers: {
          'Content-Type': 'application/json',
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
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'json',
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
