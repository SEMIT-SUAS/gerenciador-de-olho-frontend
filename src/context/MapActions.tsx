import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { Acao } from '../types/Acao';
import { type Denuncia } from '../types/Denuncia';

type SelectAcoesOuDenunciasProps = {
  salvarDenunciasOnclick: boolean;
  setSalvarDenunciasOnClick: Dispatch<SetStateAction<boolean>>;
  salvarAcaoOnclick: boolean;
  setSalvarAcaoOnclick: Dispatch<SetStateAction<boolean>>;
  acaoSelecionada: Acao | null;
  setAcaoSelecionada: Dispatch<SetStateAction<Acao | null>>;
  denunciasSelecionas: Denuncia[];
  setDenunciasSelecionadas: Dispatch<SetStateAction<Denuncia[]>>;
};

const MapActionsContext = createContext<
  SelectAcoesOuDenunciasProps | undefined
>(undefined);

export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [salvarDenunciasOnclick, setSalvarDenunciasOnClick] = useState(false);
  const [salvarAcaoOnclick, setSalvarAcaoOnclick] = useState(false);

  const [acaoSelecionada, setAcaoSelecionada] = useState<Acao | null>(null);
  const [denunciasSelecionas, setDenunciasSelecionadas] = useState<Denuncia[]>(
    [],
  );

  const value: SelectAcoesOuDenunciasProps = {
    salvarDenunciasOnclick,
    setSalvarDenunciasOnClick,
    salvarAcaoOnclick,
    setSalvarAcaoOnclick,
    acaoSelecionada,
    setAcaoSelecionada,
    denunciasSelecionas,
    setDenunciasSelecionadas,
  };

  return (
    <MapActionsContext.Provider value={value}>
      {children}
    </MapActionsContext.Provider>
  );
}

export function useMapActions() {
  const context = useContext(MapActionsContext);

  if (!context)
    throw new Error(
      'For access context data must the component being child of context provider',
    );

  return context;
}
