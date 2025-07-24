import type { CreateDenunciaModel, DenunciaModel } from '../types/Denuncia.ts';
import { API_BASE_URL } from '../config/api.ts';
import { denunciasMock, userMock } from '../constants/mocks.ts';
import convert from 'xml-js';
import categoriaService from './categoriaService.ts';

type addressResponseData = {
  rua: string;
  bairro: string;
};

export let denunciasData: DenunciaModel[] = denunciasMock;

export function updateDenunciasData(
  newArray: DenunciaModel[],
): DenunciaModel[] {
  denunciasData = newArray;
  return denunciasData;
}

async function getAllDenuncias(): Promise<DenunciaModel[]> {
  return denunciasData;
}

async function getDenunciaById(id: number): Promise<DenunciaModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/denuncias/${id}`, {
      method: 'GET',
    });

    if (response.status !== 200) {
      throw new Error('Não foi possível encontrar a denúncia.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function createDenuncia(
  newDenuncia: CreateDenunciaModel,
): Promise<DenunciaModel> {
  const tipo = await categoriaService.getTipoById(newDenuncia.tipoId);

  const denunciaCreatedData: DenunciaModel = {
    id: Math.floor(Math.random() * 100000),
    descricao: newDenuncia.descricao,
    bairro: newDenuncia.bairro,
    rua: newDenuncia.rua,
    pontoDeReferencia: newDenuncia.pontoDeReferencia,
    latitude: newDenuncia.latitude,
    longitude: newDenuncia.longitude,
    tipo: tipo!,
    files: newDenuncia.files.map((f, idx) => ({
      id: idx,
      tipo: 'imagem',
      nome: f.name,
    })),
    acao: null,
    criadaEm: new Date().toISOString(),
    usuario: userMock,
    denunciaIndeferida: null,
  };

  denunciasData.push(denunciaCreatedData);

  return denunciaCreatedData;
}

async function updateDenuncia(denuncia: DenunciaModel): Promise<DenunciaModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/denuncias/${denuncia.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(denuncia),
    });

    if (response.status !== 200) {
      throw new Error('Não foi possível atualizar a denúncia.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function indeferirDenuncia(
  id: number,
  motivoStatus: string,
): Promise<DenunciaModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/denuncias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'indeferido',
        motivo: motivoStatus,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Erro desconhecido na API.' }));
      throw new Error(
        errorData.message || 'Não foi possível atualizar o status na API.',
      );
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function vincularDenunciaToAcao(): Promise<DenunciaModel> {
  return null;
}

async function desvincularDenunciaAcao(denunciaId: number): Promise<void> {
  const updatedDenunciaData = denunciasData.map((d) => {
    if (d.id === denunciaId) {
      return {
        ...d,
        acao: null,
      };
    }

    return d;
  });

  denunciasData = updatedDenunciaData;
}

async function getAddressByCoordinates(
  lat: number,
  lng: number,
): Promise<addressResponseData> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lon=${lng}&lat=${lat}`,
    );

    if (response.status != 200) {
      throw new Error(
        'Não foi possível achar as informações desse endereço. Coloque manualmente',
      );
    }

    const xmlText = await response.text();
    const jsonString = convert.xml2json(xmlText, { compact: true });
    const json = JSON.parse(jsonString);

    const address = json.reversegeocode.addressparts;

    const infos: addressResponseData = {
      bairro: address.neighbourhood._text,
      rua: address.road._text,
    };

    return infos;
  } catch {
    throw new Error(
      'Não foi possível buscar as informações desse local selecionado. Tente novamente mais tarde',
    );
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
  getAddressByCoordinates,
  updateDenunciasData,
};
