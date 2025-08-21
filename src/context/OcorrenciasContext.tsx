import {
  useContext,
  useEffect,
  useState,
  createContext,
  type ReactNode,
  useMemo,
} from 'react';

import type { Bairro } from '@/types/Bairro';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import type { Secretaria } from '@/types/Secretaria';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import CategoriaDenunciaService from '@/services/CategoriaDenunciaService';
import tiposDenunciaService from '@/services/tiposDenunciaService';
import secretariaService from '@/services/secretariaService';
import { DADOS_BAIRROS } from '@/constants/dadosDeBairros';
import { useMapActions } from './MapActions';
import { DenunciaService } from '@/services/DenunciaService';
import { FilterDenunciaStatusSelect } from '@/pages/OcorrenciasPage/components/Map/MapFilters/FilterDenunciaStatusSelect';
import { useAuth } from './AuthContext';
import { useFilters } from './FiltersContext';
import type { DenunciaInMap } from '@/types/Denuncia';

type OcorrenciasContextProps = {
  isLoadingInitialContent: boolean;
  APIError: null | string;
  bairros: Bairro[];
  categorias: CategoriaDenunciaModel[];
  categoriaTipos: TipoDenunciaModel[];
  secretarias: Secretaria[];
  denunciasDoBairro: DenunciaInMap[];
};

const OcorrenciasContext = createContext<OcorrenciasContextProps | undefined>(
  undefined,
);

export function OcorrenciasProvider({ children }: { children: ReactNode }) {
  const [APIError, setAPIError] = useState<null | string>(null);
  const [isLoadingInitialContent, setIsLoadingInitialContent] =
    useState<boolean>(true);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[]>([]);
  const [categoriaTipos, setCategoriaTipos] = useState<TipoDenunciaModel[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [denunciasDoBairro, setDenunciasDoBairro] = useState<DenunciaInMap[]>(
    [],
  );

  const { filtroStatusDenuncia } = useFilters();

  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const [
          categoriasData,
          categoriaTiposData,
          secretariasData,
          dataDenunciasInMap,
        ] = await Promise.all([
          CategoriaDenunciaService.getAll(),
          tiposDenunciaService.getAllTiposDenuncia(),
          secretariaService.getAllSecretarias(),
          DenunciaService.getNumberDenunciasInMap(
            filtroStatusDenuncia,
            user?.idSecretaria!,
          ),
        ]);

        setCategorias(categoriasData);
        setCategoriaTipos(categoriaTiposData);
        setSecretarias(secretariasData);

        const bairroPromises = DADOS_BAIRROS.map((bairro) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const totalDeDenuncias =
                dataDenunciasInMap.find(
                  (dInMap) => dInMap.bairro === bairro.nome,
                )?.quantidade || 0;

              const bairroFormatado = {
                ...bairro,
                totalDeDenuncias,
              };

              resolve(bairroFormatado);
            }, 0);
          });
        });

        const formattedBairros = (await Promise.all(
          bairroPromises,
        )) as Bairro[];

        setBairros(formattedBairros);
      } catch (error: any) {
        setAPIError(error.message);
      } finally {
        setIsLoadingInitialContent(false);
      }
    }

    loadData();
  }, []);

  // useEffect(() => {
  //   const fetchDenunciasFiltradas = async () => {
  //     if (!currentBairroId) {
  //       setDenunciasDoBairro([]);
  //       return;
  //     }

  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const params = {
  //         bairro: String(currentBairroId),

  //         status:
  //           filtroStatusDenuncia === 'todos'
  //             ? ''
  //             : filtroStatusDenuncia.join(','),

  //         secretaria:
  //           filtroSecretaria === 'todas' || filtroSecretaria === null
  //             ? 0
  //             : Number(filtroSecretaria),

  //         tipoDenuncia:
  //           filtroTipoDenuncia === 'todos' || filtroTipoDenuncia === null
  //             ? ''
  //             : filtroTipoDenuncia,
  //       };

  //       const denuncias = await DenunciaService.getDenunciaPorBairro(params);
  //       setDenunciasDoBairro(denuncias);
  //     } catch (err) {
  //       console.error('Falha ao buscar denúncias:', err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchDenunciasFiltradas();
  // }, [
  //   currentBairroId,
  //   filtroStatusDenuncia,
  //   filtroSecretaria,
  //   filtroTipoDenuncia,
  // ]);

  // Exemplo de como usar os estados no seu JSX
  // if (isLoading) {
  //   return <div>Carregando denúncias...</div>;
  // }

  // if (error) {
  //   return <div>Erro: {error}</div>;
  // }

  const value: OcorrenciasContextProps = {
    isLoadingInitialContent,
    APIError,
    bairros,
    categorias,
    categoriaTipos,
    secretarias,
    denunciasDoBairro,
  };

  return (
    <OcorrenciasContext.Provider value={value}>
      {children}
    </OcorrenciasContext.Provider>
  );
}

export const useOcorrencias = () => {
  const context = useContext(OcorrenciasContext);
  if (context === undefined)
    throw new Error(
      'useOcorrenciasContext deve ser usado dentro de um OcorrenciasProvider',
    );

  return context;
};
