import type { AcaoModel, CreateAcaoModel } from '../types/Acao';
import { API_BASE_URL } from '../config/api';
import { getPolygonoCenter } from '../utils/geometry';
import type { SecretariaModel } from '../types/Secretaria';
import { secretariasMock, userMock } from '../constants/mocks';

const acoes: AcaoModel[] = [];

async function getAllAcoes(): Promise<AcaoModel[]> {
  return acoes;
}

async function createAcao(createAcaoData: CreateAcaoModel): Promise<AcaoModel> {
  const centerCoordinates = getPolygonoCenter(
    createAcaoData.denuncias.map((d) => [d.latitude, d.longitude]),
  );

  const secretaria: SecretariaModel = secretariasMock.find(
    (sc) => sc.id === createAcaoData.secretariaId,
  )!;

  const acaoCreatedData: AcaoModel = {
    id: Math.floor(Math.random() * 100000),
    nome: createAcaoData.nome,
    obs: createAcaoData.obs,
    secretaria,
    latitude: centerCoordinates[0],
    longitude: centerCoordinates[1],
    criadoEm: new Date().toUTCString(),
    status: [
      {
        id: 1,
        motivo: 'Criada',
        AlteradoEm: new Date().toUTCString(),
        alteradoPor: userMock,
        status: 'em_analise',
      },
    ],
  };

  // acoes.push(acaoCreatedData);
  return acaoCreatedData;
}

async function getAcaoById(id: number): Promise<AcaoModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/acoes/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Não foi possível encontrar a ação.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

async function updateAcao(acao: AcaoModel): Promise<AcaoModel> {
  try {
    const response = await fetch(`${API_BASE_URL}/acoes/${acao.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(acao),
    });

    if (!response.ok) {
      throw new Error('Não foi possível atualizar a ação.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
    );
  }
}

export default {
  getAllAcoes,
  createAcao,
  updateAcao,
  getAcaoById,
};
