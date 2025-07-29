import type { ServicoCategoria } from '../types/CategoriaServico';
import { API_BASE_URL } from '../config/api';
import type { ServicoCategoriaEditar } from '../types/ServicoCategoriaEditar';

export async function getAllCategorias(): Promise<ServicoCategoria[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categoria-servico/listar-ativos`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível listar as categorias.');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro ao buscar categorias. Tente novamente mais tarde.');
  }
}

export async function createCategoria(categoria: ServicoCategoria): Promise<string> {
  const formData = new FormData();
  formData.append('nome', categoria.nome);
  formData.append('visivel', String(categoria.visivel));
  formData.append('ativo', String(categoria.ativo));
  if (categoria.icone) {
    formData.append('icone', categoria.icone);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/categoria-servico/cadastrar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Não foi possível cadastrar a categoria.');
    }

    return await response.text(); // ou response.json(), dependendo do backend
  } catch (error) {
    throw new Error('Erro ao cadastrar categoria. Tente novamente mais tarde.');
  }
}

export async function editarCategoria(categoria: ServicoCategoriaEditar): Promise<string> {
  try {
    const formData = new FormData();

    formData.append('id', categoria.id.toString());
    formData.append('nome', categoria.nome);

    if (categoria.icone && categoria.icone instanceof File) {
      formData.append('icone', categoria.icone);
    }

    const response = await fetch(`${API_BASE_URL}/categoria-servico/atualizar/layout`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Não foi possível editar a categoria. Status ${response.status}. Detalhes: ${errorText}`);
    }

    return await response.text();
  } catch (error) {
    throw new Error(`Erro ao editar categoria: ${(error as Error).message}`);
  }
}

// Ativa/desativa a categoria (toggle)
export async function toggleAtivo(id: number, ativo: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categoria-servico/atualizar/atividade`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ativo }),
  });
  if (!response.ok) throw new Error('Erro ao alterar status ativo:');
}

// Mostra/oculta a categoria (toggle)
export async function toggleVisivel(id: number, visivel: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categoria-servico/atualizar/visibilidade`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, visivel }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao atualizar visibilidade. Status ${response.status}: ${errorText}`);
  }
}