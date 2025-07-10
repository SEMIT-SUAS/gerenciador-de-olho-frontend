import { createContext, useContext, useEffect, useState } from 'react';
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import type { Denuncia } from '../types/Denuncia';
import type { Acao } from '../types/Acao';
import denunciasService from '../services/denunciasService';
import acoesService from '../services/acoesService';
import type { StatusModel } from '../types/StatusModel';
import type { Secretaria } from '../types/Secretaria';

interface OcorrenciasContextType {
  denuncias: Denuncia[];
  setDenuncias: Dispatch<SetStateAction<Denuncia[]>>;
  actualDetailItem: Denuncia | Acao | null;
  prevAction: Acao | null;
  setPrevAction: Dispatch<SetStateAction<Acao | null>>;
  setActualDetailItem: Dispatch<SetStateAction<Denuncia | Acao | null>>;
  acoes: Acao[];
  setAcoes: Dispatch<SetStateAction<Acao[]>>;
  loading: boolean;
  error: string | null;
  vincularDenunciaAcao: (denunciaId: number, acaoId: number) => Promise<void>;
  indeferirDenuncia: (
    denunciaId: number,
    status: StatusModel,
    motivoStatus: string,
  ) => Promise<void>;
  secretarias: Secretaria[];
  setSecretarias: Dispatch<SetStateAction<Secretaria[]>>;
}

const OcorrenciasContext = createContext<OcorrenciasContextType | undefined>(
  undefined,
);

export const OcorrenciasProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actualDetailItem, setActualDetailItem] = useState<
    Denuncia | Acao | null
  >(null);
  const [prevAction, setPrevAction] = useState<Acao | null>(null);

  async function fetchSecretarias(): Promise<Secretaria[] | null> {
    try {
      return [
        { id: 1, name: 'SEMMAM' },
        { id: 2, name: 'SEMOSP' },
        { id: 3, name: 'SEMURH' },
      ];
    } catch (error) {
      return [];
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [denunciasData, acoesData] = await Promise.all([
          denunciasService.getAllDenuncias(),
          acoesService.getAllAcoes(),
        ]);
        setDenuncias(denunciasData);
        setAcoes(acoesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    fetchSecretarias().then((data) => setSecretarias(data));
  }, []);

  const vincularDenunciaAcao = async (denunciaId: number, acaoId: number) => {
    try {
      const denunciaAtualizada = await denunciasService.vincularDenunciaToAcao(
        denunciaId,
        acaoId,
      );
      setDenuncias((prev) =>
        prev.map((d) => (d.id === denunciaId ? denunciaAtualizada : d)),
      );
      console.log('Denúncia vinculada com sucesso:', denunciaAtualizada);
    } catch (error) {
      console.error('Falha ao vincular denúncia:', error);
      alert('Não foi possível vincular a denúncia.');
    }
  };

  const indeferirDenuncia = async (
    denunciaId: number,
    motivoStatus: string,
  ) => {
    try {
      const denunciaAtualizada = await denunciasService.indeferirDenuncia(
        denunciaId,
        motivoStatus,
      );
      setDenuncias((prev) =>
        prev.map((d) => (d.id === denunciaId ? denunciaAtualizada : d)),
      );
    } catch (error) {
      console.error('Falha ao indeferir denúncia:', error);
      alert('Não foi possível indeferir a denúncia.');
    }
  };

  const value = {
    denuncias,
    setDenuncias,
    acoes,
    setAcoes,
    actualDetailItem,
    prevAction,
    setPrevAction,
    setActualDetailItem,
    loading,
    error,
    vincularDenunciaAcao,
    indeferirDenuncia,
    secretarias,
    setSecretarias,
  };

  return (
    <OcorrenciasContext.Provider value={value}>
      {children}
    </OcorrenciasContext.Provider>
  );
};

export const useOcorrenciasContext = () => {
  const context = useContext(OcorrenciasContext);
  if (context === undefined)
    throw new Error(
      'useOcorrenciasContext deve ser usado dentro de um OcorrenciasProvider',
    );
  return context;
};
