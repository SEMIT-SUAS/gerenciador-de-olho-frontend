import type { DenunciaModel } from '../types/Denuncia.ts';
import { API_BASE_URL } from '../config/api.ts';
import { denunciasMock, userMock } from '../constants/mocks.ts';
import convert from 'xml-js';
import { acoes } from './acoesService.ts';

type addressResponseData = {
  rua: string;
  bairro: string;
  cep: string;
};

export let denunciasData: DenunciaModel[] = denunciasMock;

export function updateDenunciasData(
  newArray: DenunciaModel[],
): DenunciaModel[] {
  denunciasData = newArray;
  return denunciasData;
}

async function getAllDenuncias(): Promise<DenunciaModel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/denuncia/listar-todas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Não foi possível encontrar a denúncia.');
    }

    const data = await response.json();

    console.log('SERVICE', data);

    return data;
  } catch (error) {
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

// async function createDenuncia(
//   newDenuncia: CreateDenunciaModel,
// ): Promise<DenunciaModel> {
//   const tipo = await categoriaService.getTipoById(newDenuncia.tipoId);

//   const denunciaCreatedData: DenunciaModel = {
//     id: Math.floor(Math.random() * 100000),
//     descricao: newDenuncia.descricao,
//     bairro: newDenuncia.bairro,
//     rua: newDenuncia.rua,
//     pontoDeReferencia: newDenuncia.pontoDeReferencia,
//     latitude: newDenuncia.latitude,
//     longitude: newDenuncia.longitude,
//     tipo: tipo!,
//     files: newDenuncia.files.map((f, idx) => ({
//       id: idx,
//       tipo: 'imagem',
//       nome: f.name,
//     })),
//     acao: null,
//     criadaEm: new Date().toISOString(),
//     usuario: userMock,
//     denunciaIndeferida: null,
//   };

//   denunciasData.push(denunciaCreatedData);

//   return denunciaCreatedData;
// }

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
  denunciaId: number,
  motivo: string,
): Promise<DenunciaModel> {
  try {
    const denuncia = denunciasData.find((d) => d.id == denunciaId)!;

    return {
      ...denuncia,
      denunciaIndeferida: {
        id: 1,
        motivo,
        indeferidaEm: new Date().toUTCString(),
        indeferidaPor: userMock,
      },
    };
  } catch (error) {
    throw error;
  }
}

async function vincularDenunciaToAcao(
  denunciaId: number,
  acaoId: number,
): Promise<DenunciaModel> {
  let denunciaUpdatedData;
  const denunciasDataUpdated = denunciasData.map((d) => {
    if (d.id === denunciaId) {
      denunciaUpdatedData = {
        ...d,
        acao: acoes.find((a) => a.id === acaoId)!,
      };

      return denunciaUpdatedData;
    }

    return d;
  });

  console.log(denunciaUpdatedData);
  updateDenunciasData(denunciasDataUpdated);
  return denunciaUpdatedData!;
}

async function desvincularDenunciaAcao(
  denunciaId: number,
): Promise<DenunciaModel> {
  let denunciaDataUpdated;

  const updatedDenunciaData = denunciasData.map((d) => {
    if (d.id === denunciaId) {
      denunciaDataUpdated = {
        ...d,
        acao: null,
      };

      return denunciaDataUpdated;
    }

    return d;
  });

  denunciasData = updatedDenunciaData;
  return denunciaDataUpdated!;
}

async function getAddressByCoordinates(
  lat: number,
  lng: number,
): Promise<addressResponseData> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lon=${lng}&lat=${lat}`,
    );

    console.log(response.status);

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
      bairro: address?.suburb._text || address?.quarter._text,
      rua: address.road._text,
      cep: address.postcode._text,
    };

    return infos;
  } catch (error) {
    console.error(error);
    throw new Error(
      'Não foi possível buscar as informações desse local selecionado. Tente novamente mais tarde',
    );
  }
}

export default {
  getAllDenuncias,
  // createDenuncia,
  updateDenuncia,
  getDenunciaById,
  indeferirDenuncia,
  vincularDenunciaToAcao,
  desvincularDenunciaAcao,
  getAddressByCoordinates,
  updateDenunciasData,
};
