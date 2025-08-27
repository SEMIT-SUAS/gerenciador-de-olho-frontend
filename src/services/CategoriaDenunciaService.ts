import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { getAPIFileURL } from '@/utils/getAPIFileURL';
import { BaseServiceClass } from './BaseServiceClass';
import type { BannerModel } from '@/types/Banner';
import { AxiosError } from 'axios';
import { api } from '@/lib/axios';

export class CategoriaDenunciaService extends BaseServiceClass {
  protected readonly serviceUnavailableError = new Error(
    'Serviço de categorias de denúncia indisponível. Tente novamente em instantes',
  );
  protected readonly notFoundError = new Error(
    'Categoria de denúncia não encontrada.',
  );
  protected readonly createError = new Error(
    'Não foi possível criar a categoria de denúncia.',
  );
  protected readonly updateError = new Error(
    'Não foi possível atualizar a categoria de denúncia.',
  );
  protected readonly visibilityError = new Error(
    'Não foi possível alterar a visibilidade da categoria de denúncia.',
  );
  protected readonly deleteError = new Error(
    'Não foi possível deletar essa categoria de denúncia.',
  );
  protected readonly serverError = new Error(
    'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
  );

  public async getAll(): Promise<CategoriaDenunciaModel[]> {
    try {
      const response = await api.get<CategoriaDenunciaModel[]>(
        '/categoria-denuncia/listar-ativos',
      );
      // Adiciona o mapeamento para transformar a URL do ícone, se necessário
      return response.data;
    } catch (error) {
      // O Axios já rejeita a promise para status não-2xx, então o catch é suficiente.
      throw this.serviceUnavailableError;
    }
  }

  public async create(data: FormData): Promise<void> {
    try {
      const response = await api.post<CategoriaDenunciaModel>(
        '/categoria-denuncia/cadastrar',
        data,
      );

      if (response.status != 201) {
        throw new Error('Não foi possível criar essa categoria de denúncia');
      }

      // const newCategory = response.data;
      // newCategory.icone = getAPIFileURL(newCategory.icone);

      // return newCategory;
    } catch (error) {
      throw this.createError;
    }
  }

  public async update(data: FormData): Promise<CategoriaDenunciaModel> {
    try {
      const response = await api.put<CategoriaDenunciaModel>(
        '/categoria-denuncia/atualizar',
        data,
      );

      const updatedCategory = response.data;
      updatedCategory.icone = getAPIFileURL(updatedCategory.icone);

      return updatedCategory;
    } catch (error) {
      throw this.updateError;
    }
  }

  public async trash(categoryId: number): Promise<void> {
    try {
      // Passamos o objeto diretamente, o Axios o converte para JSON
      await api.put('/categoria-denuncia/atualizar/atividade', {
        id: categoryId,
        ativo: false,
      });
    } catch (error) {
      throw this.deleteError;
    }
  }

  public async toggleVisibility(
    categoryId: number,
    visibility: boolean,
  ): Promise<void> {
    try {
      await api.put('/categoria-denuncia/atualizar/visibilidade', {
        id: categoryId,
        visivel: visibility,
      });
    } catch (error) {
      throw this.visibilityError;
    }
  }

  //   async getAllByBairro(
  //     bairroId: number,
  //     status: DenunciaStatusModelTypes,
  //   ): Promise<DenunciaModel[]> {
  //     // TODO: Implementar a lógica de busca
  //     return [];
  //   }
}

export class BannerService extends BaseServiceClass {
  protected readonly serviceUnavailableError = new Error(
    'Serviço de banners indisponível.',
  );
  protected readonly notFoundError = new Error('Nenhum banner encontrado.');
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
    'Não foi possível deletar o banner.',
  );
  protected readonly serverError = new Error(
    'Erro no servidor ao processar a requisição do banner.',
  );

  public async getAll(): Promise<BannerModel[]> {
    try {
      // O Axios já parseia o JSON por padrão. response.data já é o objeto/array.
      const response = await api.get<BannerModel[]>('/banner/listar-ativos');
      return response.data.map((banner) => ({
        ...banner,
        imagem: getAPIFileURL(banner.imagem),
      }));
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw this.notFoundError;
      }
      throw this.serviceUnavailableError;
    }
  }

  public async upload(formData: FormData): Promise<BannerModel> {
    try {
      const response = await api.post<BannerModel>(
        '/banner/cadastrar',
        formData,
      );
      const newBanner = response.data;
      newBanner.imagem = getAPIFileURL(newBanner.imagem);
      return newBanner;
    } catch (error) {
      throw this.createError;
    }
  }

  public async update(formData: FormData): Promise<BannerModel> {
    try {
      const response = await api.put<BannerModel>(
        '/banner/atualizar',
        formData,
      );
      const updatedBanner = response.data;
      updatedBanner.imagem = getAPIFileURL(updatedBanner.imagem);
      return updatedBanner;
    } catch (error) {
      throw this.updateError;
    }
  }

  public async toggleVisibility(
    bannerId: number,
    visible: boolean,
  ): Promise<void> {
    try {
      // Enviando o corpo da requisição como um objeto JS.
      await api.put('/banner/atualizar/visibilidade', {
        id: bannerId,
        visivel: visible,
      });
    } catch (error) {
      throw this.visibilityError;
    }
  }

  public async trash(bannerId: number): Promise<void> {
    try {
      await api.put('/banner/atualizar/atividade', {
        id: bannerId,
        ativo: false,
      });
    } catch (error) {
      throw this.deleteError;
    }
  }
}
