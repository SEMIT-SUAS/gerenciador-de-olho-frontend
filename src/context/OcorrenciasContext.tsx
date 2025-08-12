import { createContext, useContext, useEffect, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { DenunciaBasicInfoModel } from '../types/Denuncia';
import type { AcaoModel } from '../types/Acao';
import type { SecretariaModel } from '../types/Secretaria';
import type { CategoriaDenunciaModel } from '../types/CategoriaDenuncia';
import { toast } from 'sonner';
import { DenunciaService } from '../services/denunciasService';
import acoesService from '@/services/acoesService';

interface OcorrenciasContextType {
  denuncias: DenunciaBasicInfoModel[];
  setDenuncias: Dispatch<SetStateAction<DenunciaBasicInfoModel[]>>;

  acoes: AcaoModel[];
  setAcoes: Dispatch<SetStateAction<AcaoModel[]>>;

  categorias: CategoriaDenunciaModel[];
  secretarias: SecretariaModel[];
  loading: boolean;
}

const OcorrenciasContext = createContext<OcorrenciasContextType | undefined>(
  undefined,
);

export function OcorrenciasProvider({ children }: { children: ReactNode }) {
  const [denuncias, setDenuncias] = useState<DenunciaBasicInfoModel[]>([]);

  const [acoes, setAcoes] = useState<AcaoModel[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[]>([]);
  const [secretarias, setSecretarias] = useState<SecretariaModel[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [denunciasData, acoesData, categoriasData, secretariasData] =
          await Promise.all([
            DenunciaService.getAllBasicInfos(),
            acoesService.getAllAcoes(),
            // categoriaService.getAll(),
            // secretariaService.getAll(),
          ]);

        setDenuncias(denunciasData);
        setAcoes(acoesData);
        // setCategorias(categoriasData);
        // setSecretarias(secretariasData);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const value: OcorrenciasContextType = {
    denuncias,
    setDenuncias,
    acoes,
    setAcoes,
    loading,
    secretarias,
    categorias,
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
