import { createContext, useContext, useEffect, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { DenunciaBasicInfoModel } from '../types/Denuncia';
import type { AcaoBasicInfoModel } from '../types/Acao';
import type { SecretariaModel } from '../types/Secretaria';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { toast } from 'sonner';

import { AcoesService } from '@/services/acoesService';
import { DenunciaService } from '@/services/DenunciaService';
import { CategoriaService } from '@/services/CategoriaService';
import { SecretariaService } from '@/services/SecretariaService';
interface OcorrenciasContextType {
  denuncias: DenunciaBasicInfoModel[];
  setDenuncias: Dispatch<SetStateAction<DenunciaBasicInfoModel[]>>;
  acoes: AcaoBasicInfoModel[];
  setAcoes: Dispatch<SetStateAction<AcaoBasicInfoModel[]>>;
  categoriaTipos: TipoDenunciaModel[];
  secretarias: SecretariaModel[];
  loading: boolean;
}

const OcorrenciasContext = createContext<OcorrenciasContextType | undefined>(
  undefined,
);

export function OcorrenciasProvider({ children }: { children: ReactNode }) {
  const [denuncias, setDenuncias] = useState<DenunciaBasicInfoModel[]>([]);
  const [acoes, setAcoes] = useState<AcaoBasicInfoModel[]>([]);

  const [categoriaTipos, setCategoriaTipos] = useState<TipoDenunciaModel[]>([]);
  const [secretarias, setSecretarias] = useState<SecretariaModel[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [denunciasData, acoesData, categoriaTiposData, secretariasData] =
          await Promise.all([
            DenunciaService.getAllBasicInfos(),
            AcoesService.getAllBasicInfos(),
            CategoriaService.getAllTipos(),
            SecretariaService.getAll(),
          ]);

        setDenuncias(denunciasData);
        setAcoes(acoesData);
        setCategoriaTipos(categoriaTiposData);
        setSecretarias(secretariasData);
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
    categoriaTipos,
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
