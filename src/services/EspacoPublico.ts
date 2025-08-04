import type { EspacoPublico } from '../types/EspacoPublico'
import { API_BASE_URL } from '../config/api'

export async function uploadEspacoPublico(formData: FormData): Promise<any> {
    try{
        const response = await fetch(`${API_BASE_URL}/espaco-publico/cadastrar`, {
            method: 'POST',
            body: formData,});

        const contentType = response.headers.get("content-type");

    if (!response.ok) {
      // Tenta extrair mensagem de erro, se possível
      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        throw new Error(errorJson.message || "Erro ao cadastrar banner.");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao cadastrar banner.");
      }
    }

    // Se for JSON
    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      // Se for texto (caso do seu backend agora)
      const text = await response.text();
      return { message: text };
    }
  } catch (error: any) {
    throw new Error(error.message || "Erro desconhecido ao cadastrar banner.");
  }
}