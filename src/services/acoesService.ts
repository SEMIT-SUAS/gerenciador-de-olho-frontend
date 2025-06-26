import type { Acao } from "../types/Acao";
import { API_BASE_URL } from "../config/api";

async function getAllAcoes(): Promise<Acao[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/acoes`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error("Não foi possível listar as ações.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde");
    }
}

async function createAcao(acao: Acao): Promise<Acao> {
    try {
        const response = await fetch(`${API_BASE_URL}/acoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(acao)
        });

        if (!response.ok) {
            throw new Error("Não foi possível criar a ação.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde");
    }
}

async function getAcaoById(id: number): Promise<Acao> {
    try {
        const response = await fetch(`${API_BASE_URL}/acoes/${id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error("Não foi possível encontrar a ação.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde");
    }
}

async function updateAcao(acao: Acao): Promise<Acao> {
    try {
        const response = await fetch(`${API_BASE_URL}/acoes/${acao.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(acao)
        });

        if (!response.ok) {
            throw new Error("Não foi possível atualizar a ação.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde");
    }
}

export default {
    getAllAcoes,
    createAcao,
    updateAcao,
    getAcaoById
}