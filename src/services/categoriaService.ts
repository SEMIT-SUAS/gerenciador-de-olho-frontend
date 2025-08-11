import { API_BASE_URL } from '@/config/api';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { getAPIFileURL } from '@/utils/getAPIFileURL';

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
