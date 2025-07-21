import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { AcaoModel } from '../types/Acao';
import { type DenunciaModel } from '../types/Denuncia';

type SelectAcoesOuDenunciasProps = {
  salvarDenunciasOnclick: boolean;
  setSalvarDenunciasOnClick: Dispatch<SetStateAction<boolean>>;
  salvarAcaoOnclick: boolean;
  setSalvarAcaoOnclick: Dispatch<SetStateAction<boolean>>;
  acaoSelecionada: AcaoModel | null;
  setAcaoSelecionada: Dispatch<SetStateAction<AcaoModel | null>>;
  denunciasSelecionas: DenunciaModel[];
  setDenunciasSelecionadas: Dispatch<SetStateAction<DenunciaModel[]>>;
  disableMapFilters: boolean;
  setDisableMapFilters: Dispatch<SetStateAction<boolean>>;
  addDenunciaNaSelecao: (newDenuncia: DenunciaModel) => void;
  denunciasJaVinculadas: DenunciaModel[];
  setDenunciasJaVinculadas: Dispatch<SetStateAction<DenunciaModel[]>>;
  isSelectingNewDenuncia: boolean;
  setIsSelectingNewDenuncia: Dispatch<SetStateAction<boolean>>;
  zoomTo: Coordinates | null;
  setZoomTo: Dispatch<SetStateAction<Coordinates | null>>;
  newDenunciaCoordinates: Coordinates | null;
  setNewDenunciaCoordinates: Dispatch<SetStateAction<Coordinates | null>>;
};

type Coordinates = {
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

  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoModel | null>(
    null,
  );
  const [denunciasSelecionas, setDenunciasSelecionadas] = useState<
    DenunciaModel[]
  >([]);

  const [isSelectingNewDenuncia, setIsSelectingNewDenuncia] = useState(false);
  const [denunciasJaVinculadas, setDenunciasJaVinculadas] = useState<
    DenunciaModel[]
  >([]);
  const [zoomTo, setZoomTo] = useState<Coordinates | null>(null);
  const [newDenunciaCoordinates, setNewDenunciaCoordinates] =
    useState<null | Coordinates>(null);

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
    isSelectingNewDenuncia,
    setIsSelectingNewDenuncia,
    zoomTo,
    setZoomTo,
    newDenunciaCoordinates,
    setNewDenunciaCoordinates,
  };

  useEffect(() => {
    setDisableMapFilters(
      salvarAcaoOnclick || salvarDenunciasOnclick ? true : false,
    );
  }, [salvarAcaoOnclick, salvarDenunciasOnclick]);

  function addDenunciaNaSelecao(newDenuncia: DenunciaModel) {
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
