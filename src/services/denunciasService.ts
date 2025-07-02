import type { Denuncia } from '../types/Denuncia.ts';
import { API_BASE_URL } from '../config/api.ts';
import type { StatusModel } from '../types/StatusModel.ts';
import convert from 'xml-js'

type addressResponseData = {
    rua: string
    bairro: string
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

async function createDenuncia(denuncia: Denuncia): Promise<Denuncia> {
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

async function updateDenunciaStatus(id: number, status: StatusModel): Promise<Denuncia> {
    const response = await fetch(`/api/denuncias/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
    });

    if (!response.ok) {
        throw new Error("Falha ao atualizar o status na API");
    }

    return response.json();
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
    updateDenunciaStatus,
    getAddressByCoordinates
};