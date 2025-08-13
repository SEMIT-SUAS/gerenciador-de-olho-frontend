import { api } from '@/lib/axios.ts';
import type {
  DenunciaBasicInfoModel,
  DenunciaModel,
} from '../types/Denuncia.ts';

export class DenunciaService {
  private static SERVICE_UNAVAILABLE_ERROR = new Error(
    'Serviço de denúncia indisponível. Tente novamente mais tarde.',
  );

  public static async getAllBasicInfos(): Promise<DenunciaBasicInfoModel[]> {
    try {
      const response = await api.get('/denuncia/listar-todos', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status != 200) {
        throw new Error('Não foi possível buscar as denúncias.');
      }

      return JSON.parse(response.data);
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getById(denunciaId: number): Promise<DenunciaModel> {
    try {
      const response = await api.get(
        `/denuncia/gerenciador/buscar-denuncia/${denunciaId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status != 200) {
        throw new Error('Não foi possível buscar essa denúncia.');
      }

      return JSON.parse(response.data);
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }

  public static async getFilesByDenunciaId(
    denunciaId: number,
  ): Promise<string[]> {
    try {
      const response = await api.get(
        `/denuncia/arquivos/uploads/${denunciaId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status != 200) {
        throw new Error('Não foi possível buscar os arquivos dessa denúncia.');
      }

      return JSON.parse(response.data);
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
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

// async function updateDenuncia(denuncia: DenunciaModel): Promise<DenunciaModel> {
//   try {
//     const response = await fetch(`${BASE_API_URL}/denuncias/${denuncia.id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(denuncia),
//     });

//     if (response.status !== 200) {
//       throw new Error('Não foi possível atualizar a denúncia.');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(
//       'Infelizmente ocorreu um erro no servidor. Tente novamente mais tarde',
//     );
//   }
// }

// async function indeferirDenuncia(
//   denunciaId: number,
//   motivo: string,
// ): Promise<DenunciaModel> {
//   try {
//     const denuncia = denunciasData.find((d) => d.id == denunciaId)!;

//     return {
//       ...denuncia,
//       denunciaIndeferida: {
//         id: 1,
//         motivo,
//         indeferidaEm: new Date().toUTCString(),
//         indeferidaPor: userMock,
//       },
//     };
//   } catch (error) {
//     throw error;
//   }
// }

// async function vincularDenunciaToAcao(
//   denunciaId: number,
//   acaoId: number,
// ): Promise<DenunciaModel> {
//   let denunciaUpdatedData;
//   const denunciasDataUpdated = denunciasData.map((d) => {
//     if (d.id === denunciaId) {
//       denunciaUpdatedData = {
//         ...d,
//         acao: acoes.find((a) => a.id === acaoId)!,
//       };

//       return denunciaUpdatedData;
//     }

//     return d;
//   });

//   console.log(denunciaUpdatedData);
//   updateDenunciasData(denunciasDataUpdated);
//   return denunciaUpdatedData!;
// }

// async function desvincularDenunciaAcao(
//   denunciaId: number,
// ): Promise<DenunciaModel> {
//   let denunciaDataUpdated;

//   const updatedDenunciaData = denunciasData.map((d) => {
//     if (d.id === denunciaId) {
//       denunciaDataUpdated = {
//         ...d,
//         acao: null,
//       };

//       return denunciaDataUpdated;
//     }

//     return d;
//   });

//   denunciasData = updatedDenunciaData;
//   return denunciaDataUpdated!;
// }
