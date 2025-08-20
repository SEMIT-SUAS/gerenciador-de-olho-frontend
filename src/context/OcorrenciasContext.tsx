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

type OcorrenciasContextProps = {
  isLoadingInitialContent: boolean;
  APIError: null | string;
  bairros: Bairro[];
  categorias: CategoriaDenunciaModel[];
  categoriaTipos: TipoDenunciaModel[];
  secretarias: Secretaria[];
};

const OcorrenciasContext = createContext<OcorrenciasContextProps | undefined>(
  undefined,
);

export function OcorrenciasProvider({ children }: { children: ReactNode }) {
  const { currentBairroId } = useMapActions();
  const [APIError, setAPIError] = useState<null | string>(null);
  const [isLoadingInitialContent, setIsLoadingInitialContent] =
    useState<boolean>(true);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[]>([]);
  const [categoriaTipos, setCategoriaTipos] = useState<TipoDenunciaModel[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);

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
            'Aberto',
            user?.idSecretaria!,
          ),
        ]);

        setCategorias(categoriasData);
        setCategoriaTipos(categoriaTiposData);
        setSecretarias(secretariasData);

        console.log(dataDenunciasInMap);

        const bairroPromises = DADOS_BAIRROS.map((bairro) => {
          // Criamos uma Promise para cada iteração.
          // O setTimeout(..., 0) é um truque para liberar a thread principal
          // e evitar que a UI congele em processamentos muito longos.
          return new Promise((resolve) => {
            setTimeout(() => {
              const totalDeDenuncias =
                dataDenunciasInMap.find(
                  (dInMap) => dInMap.bairro === bairro.nome,
                )?.quantidade || 0; // Usei 0 em vez de 1, parece mais seguro.

              const bairroFormatado = {
                ...bairro,
                totalDeDenuncias,
              };

              // 4. Resolve a Promise com o resultado do item
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

  useEffect(() => {}, [currentBairroId]);

  const value: OcorrenciasContextProps = {
    isLoadingInitialContent,
    APIError,
    bairros,
    categorias,
    categoriaTipos,
    secretarias,
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
