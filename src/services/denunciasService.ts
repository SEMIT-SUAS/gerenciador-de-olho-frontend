import type { CreateDenunciaModel, DenunciaModel } from '../types/Denuncia.ts';
import { API_BASE_URL } from '../config/api.ts';
import convert from 'xml-js';

type addressResponseData = {
  rua: string;
  bairro: string;
};

async function getAllDenuncias() {
  try {
    const response = await fetch(`${API_BASE_URL}/denuncias`, {
      method: 'GET',
    });

    const data: DenunciaModel[] = await response.json();

    if (response.status != 200) {
      throw new Error('Não foi possível listar as denúncias.');
    }

    return data;
  } catch {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
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
  return {
    id: Math.floor(Math.random() * 100000),
    descricao: newDenuncia.descricao,
    bairro: newDenuncia.bairro,
    rua: newDenuncia.rua,
    pontoDeReferencia: newDenuncia.pontoDeReferencia,
    latitude: newDenuncia.latitude,
    longitude: newDenuncia.longitude,
    tipo: {
      id: newDenuncia.tipoId,
      nome: 'Tipo mockado',
      cor: '#32333',
      categoria: {
        id: 1,
        nome: 'Categoria mockada',
      },
    },
    files: newDenuncia.files.map((f, idx) => ({
      id: idx,
      tipo: 'imagem',
      nome: f.name,
    })),
    acaoId: null,
    criadaEm: new Date().toISOString(),
    usuario: {
      id: 1,
      nome: 'Usuário Mock',
      cpf: '000.000.000-00',
      telefone: '000000000',
      email: 'mock@mock.com',
      senha: '',
      secretaria: {
        id: 1,
        nome: 'Secretaria Mock',
        sigla: 'SM',
      },
      perfil: {
        id: 1,
        nome: 'Cidadão',
      },
      criadoEm: new Date().toISOString(),
      criadoPor: null,
    },
    denunciaIndeferida: null,
  };
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
    console.error('Erro no serviço ao indeferir denúncia:', error);
    throw error;
  }
}

async function desvincularDenunciaAcao(
  id: number,
  motivoStatus: string,
): Promise<DenunciaModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/denuncias/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        acaoId: null,
        status: 'aberto',
        motivoStatus: motivoStatus,
      }),
    });
    await new Promise((r) => setTimeout(r, 300));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Não foi possível desvincular da ação',
      );
    }

    return await response.json();
  } catch (error) {
    console.log('Error no serviço de desvinculação:', error);

    throw error;
  }
}

async function vincularDenunciaToAcao(
  id: number,
  acaoId: number,
): Promise<DenunciaModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/denuncias/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        acaoId,
        status: 'em_andamento',
      }),
    });
    await new Promise((r) => setTimeout(r, 300));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Não foi possível vincular a denúncia à ação.',
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no serviço de vinculação:', error);

    throw error;
  }
}

async function getAddressByCoordinates(
  lng: number,
  lat: number,
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
};
