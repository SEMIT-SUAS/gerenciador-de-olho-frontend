import type { ServicoCategoria } from '../types/CategoriaServico';
import { API_BASE_URL } from '../config/api';

export async function getAllCategorias(): Promise<ServicoCategoria[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categorias/listar`, {
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
    const response = await fetch(`${API_BASE_URL}/categorias/cadastrar`, {
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