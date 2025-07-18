import {
  createContext,
  useContext,
  useEffect,
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
  disableMapFilters: boolean;
  setDisableMapFilters: Dispatch<SetStateAction<boolean>>;
  addDenunciaNaSelecao: (newDenuncia: Denuncia) => void;
  denunciasJaVinculadas: Denuncia[];
  setDenunciasJaVinculadas: Dispatch<SetStateAction<Denuncia[]>>;
  isAddingDenuncia: boolean;
  setIsAddingDenuncia: Dispatch<SetStateAction<boolean>>;
  zoomTo: ZoomCoordinates | null;
  setZoomTo: Dispatch<SetStateAction<ZoomCoordinates | null>>;
};

type ZoomCoordinates = {
  lat: number;
  lng: number;
};

const MapActionsContext = createContext<
  SelectAcoesOuDenunciasProps | undefined
>(undefined);

export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [disableMapFilters, setDisableMapFilters] = useState(false);
  const [salvarDenunciasOnclick, setSalvarDenunciasOnClick] = useState(false);
  const [salvarAcaoOnclick, setSalvarAcaoOnclick] = useState(false);

  const [acaoSelecionada, setAcaoSelecionada] = useState<Acao | null>(null);
  const [denunciasSelecionas, setDenunciasSelecionadas] = useState<Denuncia[]>(
    [],
  );

  const [isAddingDenuncia, setIsAddingDenuncia] = useState(false);
  const [denunciasJaVinculadas, setDenunciasJaVinculadas] = useState<
    Denuncia[]
  >([]);
  const [zoomTo, setZoomTo] = useState<ZoomCoordinates | null>(null);

  const value: SelectAcoesOuDenunciasProps = {
    salvarDenunciasOnclick,
    setSalvarDenunciasOnClick,
    salvarAcaoOnclick,
    setSalvarAcaoOnclick,
    acaoSelecionada,
    setAcaoSelecionada,
    denunciasSelecionas,
    setDenunciasSelecionadas,
    disableMapFilters,
    setDisableMapFilters,
    addDenunciaNaSelecao,
    denunciasJaVinculadas,
    setDenunciasJaVinculadas,
    isAddingDenuncia,
    setIsAddingDenuncia,
    zoomTo,
    setZoomTo,
  };

  useEffect(() => {
    setDisableMapFilters(
      salvarAcaoOnclick || salvarDenunciasOnclick ? true : false,
    );
  }, [salvarAcaoOnclick, salvarDenunciasOnclick]);

  function addDenunciaNaSelecao(newDenuncia: Denuncia) {
    if (denunciasSelecionas.find((d) => d.id == newDenuncia.id)) {
      setDenunciasSelecionadas((denuncias) =>
        denuncias.filter((d) => d.id !== newDenuncia.id),
      );
    } else {
      setDenunciasSelecionadas((denuncias) => [...denuncias, newDenuncia]);
    }
  }

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
