import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { BaseServiceClass } from './BaseServiceClass';
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
      const response = await api.get('/categoria-denuncia/listar-ativos', {
        responseType: 'json',
      });

      if (response.status === 404) {
        throw this.notFoundError;
      }

      if (response.status !== 200) {
        throw new Error('Ocorreu um erro na busca desse Banner');
      }
      return response.data as CategoriaDenunciaModel[];
    } catch (error) {
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
      return response.data;
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
