import { api } from '@/lib/axios';
import type { AcaoBasicInfoModel, AcaoModel } from '@/types/Acao';

export class AcoesService {
  private static SERVICE_UNAVAILABLE_ERROR = new Error(
    'Serviço de ação indisponível. Tente novamente mais tarde.',
  );

  public static async getAllBasicInfos(): Promise<AcaoBasicInfoModel[]> {
    try {
      const response = await api.get('/acao/listar-ativos');

      if (response.status != 200) {
        throw new Error('Não foi possível buscar as ações.');
      }

      return JSON.parse(response.data) as AcaoBasicInfoModel[];
    } catch {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getById(acaoId: number): Promise<AcaoModel> {
    try {
      const response = await api.get(`/acao/buscar/${acaoId}`);

      if (response.status != 200) {
        throw new Error('Não foi possível buscar essa ação.');
      }

      return JSON.parse(response.data) as AcaoModel;
    } catch {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }
}

// async function getAllAcoes(): Promise<AcaoModel[]> {
//   return acoes;
// }

// async function createAcao(createAcaoData: CreateAcaoModel): Promise<AcaoModel> {
//   const centerCoordinates = getPolygonoCenter(
//     createAcaoData.denuncias.map((d) => [d.latitude, d.longitude]),
//   );

//   const secretaria: SecretariaModel = secretariasMock.find(
//     (sc) => sc.id === createAcaoData.secretariaId,
//   )!;

//   const acaoCreatedData: AcaoModel = {
//     id: Math.floor(Math.random() * 100000),
//     nome: createAcaoData.nome,
//     obs: createAcaoData.obs,
//     secretaria,
//     latitude: centerCoordinates[0],
//     longitude: centerCoordinates[1],
//     criadoEm: new Date().toUTCString(),
//     status: [
//       {
//         id: 1,
//         motivo: 'Criada',
//         AlteradoEm: new Date().toUTCString(),
//         alteradoPor: userMock,
//         status: 'em_analise',
//       },
//     ],
//   };

//   // acoes.push(acaoCreatedData);
//   return acaoCreatedData;
// }

// async function getAcaoById(id: number): Promise<AcaoModel> {
//   try {
//     const response = await fetch(`${BASE_API_URL}/acoes/${id}`, {
//       method: 'GET',
//     });

//     if (!response.ok) {
//       throw new Error('Não foi possível encontrar a ação.');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(
//       'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
//     );
//   }
// }

// async function updateAcao(acao: AcaoModel): Promise<AcaoModel> {
//   try {
//     const response = await fetch(`${BASE_API_URL}/acoes/${acao.id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(acao),
//     });

//     if (!response.ok) {
//       throw new Error('Não foi possível atualizar a ação.');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(
//       'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
//     );
//   }
// }

// export default {
//   getAllAcoes,
//   createAcao,
//   updateAcao,
//   getAcaoById,
// };
