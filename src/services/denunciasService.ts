import type { Denuncia } from '../types/Denuncia.ts';
import { API_BASE_URL } from '../config/api.ts';
import convert from 'xml-js'

type addressResponseData = {
    rua: string
    bairro: string
}

type CreateDenunciaProps = {
    description: string
    categoryId: number
    categoryTipoId: number
    address: {
        lon: number,
        lat: number,
        rua: string,
        bairro: string
        pontoDeReferencia: string
    }
}

async function getAllDenuncias() {
    try {
        const response = await fetch(`${API_BASE_URL}/denuncias`, {
            method: 'GET'
        })

        const data: Denuncia[] = await response.json();

        if (response.status != 200) {
            throw new Error("Não foi possível listar as denúncias.");
        }

        return data;
    } catch {
        throw new Error("Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde")
    }
}

async function getDenunciaById(id: number): Promise<Denuncia> {
    try {
        const response = await fetch(`${API_BASE_URL}/denuncias/${id}`, {
            method: 'GET'
        });

        if (response.status !== 200) {
            throw new Error("Não foi possível encontrar a denúncia.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde");
    }
}

async function createDenuncia(denuncia: CreateDenunciaProps): Promise<Denuncia> {
    return {
        "id": 1000,
        "titulo": "Buraco na Av. dos Holandeses",
        descricao: "Teste",
        acaoId: null,
        status: 'aberto',
        tipo: {
            id: 2,
            name: "Buraco na rua"
        },
        "created_at": "2025-06-15T10:30:00Z",
        "categoria": {
            id: 1,
            name: 'Infraestrutura',
            description: 'Problemas de infraestrutura em ambientes publicos',
            tipos: []
        },
        images: [],
        "endereco": {
            "cep": "65071-380",
            "rua": "Avenida dos Holandeses",
            "bairro": "Calhau",
            "ponto_referencia": "Próximo ao retorno do Calhau, em frente à farmácia",
            "latitude": -4.4943,
            "longitude": -34.2941
        },
    }

    try {
        const response = await fetch(`${API_BASE_URL}/denuncias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(denuncia)
        });

        if (response.status !== 201) {
            throw new Error("Não foi possível criar a denúncia.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde");
    }
}

async function updateDenuncia(denuncia: Denuncia): Promise<Denuncia> {
    try {
        const response = await fetch(`${API_BASE_URL}/denuncias/${denuncia.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(denuncia)
        });

        if (response.status !== 200) {
            throw new Error("Não foi possível atualizar a denúncia.");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde");
    }
}

async function indeferirDenuncia(id: number, motivoStatus: string): Promise<Denuncia> {
    try {
        const response = await fetch(`${API_BASE_URL}/denuncias/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'indeferido', 
                motivo: motivoStatus 
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Erro desconhecido na API." }));
            throw new Error(errorData.message || "Não foi possível atualizar o status na API.");
        }

        return await response.json();

    } catch (error) {
        console.error("Erro no serviço ao indeferir denúncia:", error);
        throw error;
    }
}

async function desvincularDenunciaAcao (id: number): Promise<Denuncia> {
    try {
        const response = await fetch(`${API_BASE_URL}/denuncias/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                acaoId: null,
                status: 'aberto'
            })
        });
        await new Promise (r => setTimeout(r, 300));

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message ||  "Não foi possível desvincular da ação")
        }

        return await response.json();
    } catch (error) {
        console.log("Error no serviço de desvinculação:", error)

        throw error
    }
}

async function vincularDenunciaToAcao(id: number, acaoId: number): Promise<Denuncia> {
    try {
        const response = await fetch(`${API_BASE_URL}/denuncias/${id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                acaoId: acaoId,
                status: 'em_andamento' 
            })
        });
        await new Promise(r => setTimeout(r, 300));

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Não foi possível vincular a denúncia à ação.");
        }

        return await response.json();

    } catch (error) {
        console.error("Erro no serviço de vinculação:", error);

      throw error;
    }
}



async function getAddressByCoordinates(lon: number, lat: number): Promise<addressResponseData> {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lon=${lon}&lat=${lat}`)

        if (response.status != 200) {
            throw new Error("Não foi possível achar as informações desse endereço. Coloque manualmente")
        }

        const xmlText = await response.text()
        const jsonString = convert.xml2json(xmlText, { compact: true })
        const json = JSON.parse(jsonString)

        const address = json.reversegeocode.addressparts

        const infos: addressResponseData = {
            bairro: address.neighbourhood._text,
            rua: address.road._text
        }

        return infos
    } catch {
        throw new Error("Não foi possível buscar as informações desse local selecionado. Tente novamente mais tarde")
    }
}

export default {
    getAllDenuncias,
    createDenuncia,
    updateDenuncia,
    getDenunciaById,
    indeferirDenuncia,
    vincularDenunciaToAcao,
    desvincularDenunciaAcao, 
    getAddressByCoordinates
};