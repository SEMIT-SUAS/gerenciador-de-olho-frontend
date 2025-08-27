import {
  useContext,
  useEffect,
  useState,
  createContext,
  type ReactNode,
} from 'react';
import type { Secretaria } from '@/types/Secretaria';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { CategoriaDenunciaService } from '@/services/CategoriaDenunciaService';
import { TipoDenunciaService } from '@/services/tiposDenunciaService';
import { secretariaService } from '@/services/secretariaService';
import type { Bairro } from '@/types/Bairro';
import { DADOS_BAIRROS } from '@/constants/dadosDeBairros';
import { DenunciaService } from '@/services/DenunciaService';
import { useAuth } from './AuthContext';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';

type OcorrenciasContextProps = {
  isLoadingInitialContent: boolean;
  APIError: null | string;
  categorias: CategoriaDenunciaModel[];
  categoriaTipos: TipoDenunciaModel[];
  secretarias: Secretaria[];
  bairros: Bairro[];
};

const OcorrenciasContext = createContext<OcorrenciasContextProps | undefined>(
  undefined,
);

export function OcorrenciasProvider({ children }: { children: ReactNode }) {
  const [isLoadingInitialContent, setIsLoadingInitialContent] =
    useState<boolean>(true);
  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[]>([]);
  const [categoriaTipos, setCategoriaTipos] = useState<TipoDenunciaModel[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [APIError, setAPIError] = useState<string | null>(null);

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
          new CategoriaDenunciaService().getAll(),
          new TipoDenunciaService().getAll(),
          secretariaService.getAll(),
          DenunciaService.getNumberDenunciasInMap(
            'Aberto',
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

  const value: OcorrenciasContextProps = {
    isLoadingInitialContent,
    APIError,
    categorias,
    categoriaTipos,
    secretarias,
    bairros,
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
