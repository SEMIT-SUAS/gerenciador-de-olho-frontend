import { createContext, useContext, useEffect, useState } from 'react';
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import type { DenunciaModel } from '../types/Denuncia';
import type { AcaoModel } from '../types/Acao';
import denunciasService from '../services/denunciasService';
import acoesService from '../services/acoesService';
import type { SecretariaModel } from '../types/Secretaria';
import categoriaService from '../services/categoriaService';
import type { CategoriaDenunciaModel } from '../types/CategoriaDenuncia';
import secretariaService from '../services/secretariaService';

interface OcorrenciasContextType {
  denuncias: DenunciaModel[];
  setDenuncias: Dispatch<SetStateAction<DenunciaModel[]>>;
  acoes: AcaoModel[];
  setAcoes: Dispatch<SetStateAction<AcaoModel[]>>;
  categorias: CategoriaDenunciaModel[];
  secretarias: SecretariaModel[];
  loading: boolean;
  error: string | null;
}

const OcorrenciasContext = createContext<OcorrenciasContextType | undefined>(
  undefined,
);

export const OcorrenciasProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [denuncias, setDenuncias] = useState<DenunciaModel[]>([]);
  const [acoes, setAcoes] = useState<AcaoModel[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[]>([]);
  const [secretarias, setSecretarias] = useState<SecretariaModel[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [denunciasData, acoesData, categoriasData, secretariasData] =
          await Promise.all([
            denunciasService.getAllDenuncias(),
            acoesService.getAllAcoes(),
            categoriaService.getAll(),
            secretariaService.getAll(),
          ]);

        setDenuncias(denunciasData);
        setAcoes(acoesData);
        setCategorias(categoriasData);
        setSecretarias(secretariasData);
      } catch (err: any) {
        setError(err.message);
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
    error,
    secretarias,
    categorias,
  };

  return (
    <OcorrenciasContext.Provider value={value}>
      {children}
    </OcorrenciasContext.Provider>
  );
};

export const useOcorrencias = () => {
  const context = useContext(OcorrenciasContext);
  if (context === undefined)
    throw new Error(
      'useOcorrenciasContext deve ser usado dentro de um OcorrenciasProvider',
    );

  return context;
};
