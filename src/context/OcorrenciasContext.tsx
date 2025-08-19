import {
  useContext,
  useEffect,
  useState,
  createContext,
  type ReactNode,
} from 'react';

import type { Bairro } from '@/types/Bairro';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import type { Secretaria } from '@/types/Secretaria';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import CategoriaDenunciaService from '@/services/CategoriaDenunciaService';
import tiposDenunciaService from '@/services/tiposDenunciaService';
import secretariaService from '@/services/secretariaService';
import { DADOS_BAIRROS } from '@/constants/dadosDeBairros';

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
  const [APIError, setAPIError] = useState<null | string>(null);
  const [isLoadingInitialContent, setIsLoadingInitialContent] =
    useState<boolean>(true);
  const [bairros, setBairros] = useState<Bairro[]>(DADOS_BAIRROS);
  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[]>([]);
  const [categoriaTipos, setCategoriaTipos] = useState<TipoDenunciaModel[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriasData, categoriaTiposData, secretariasData] =
          await Promise.all([
            CategoriaDenunciaService.getAll(),
            tiposDenunciaService.getAllTiposDenuncia(),
            secretariaService.getAllSecretarias(),
          ]);

        setCategorias(categoriasData);
        setCategoriaTipos(categoriaTiposData);
        setSecretarias(secretariasData);
      } catch (error: any) {
        setAPIError('Teste');
      } finally {
        setIsLoadingInitialContent(false);
      }
    }

    loadData();
  }, []);

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
