import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { AcaoDetailsModel, AcaoModel } from '../types/Acao';
import { type DenunciaInMap, type DenunciaModel } from '../types/Denuncia';
import type { NumeroDeDenunciasPorBairro } from '@/types/Bairro';

type SelectAcoesOuDenunciasProps = {
  salvarDenunciasOnclick: boolean;
  setSalvarDenunciasOnClick: Dispatch<SetStateAction<boolean>>;
  salvarAcaoOnclick: boolean;
  setSalvarAcaoOnclick: Dispatch<SetStateAction<boolean>>;
  acaoSelecionada: AcaoDetailsModel | null;
  setAcaoSelecionada: Dispatch<SetStateAction<AcaoDetailsModel | null>>;
  denunciasSelecionadas: DenunciaInMap[];
  setDenunciasSelecionadas: Dispatch<SetStateAction<DenunciaInMap[]>>;
  disableMapFilters: boolean;
  setDisableMapFilters: Dispatch<SetStateAction<boolean>>;
  toggleDenunciaSelecionadas: (newDenuncia: DenunciaInMap) => void;
  denunciasJaVinculadas: DenunciaModel[];
  setDenunciasJaVinculadas: Dispatch<SetStateAction<DenunciaModel[]>>;
  isSelectingNewDenuncia: boolean;
  setIsSelectingNewDenuncia: Dispatch<SetStateAction<boolean>>;
  zoomTo: Coordinates | null;
  setZoomTo: Dispatch<SetStateAction<Coordinates | null>>;
  newDenunciaCoordinates: Coordinates | null;
  setNewDenunciaCoordinates: Dispatch<SetStateAction<Coordinates | null>>;
  toggleAcaoSelecionada: (acao: AcaoDetailsModel) => void;
  currentBairroId: number | null;
  setCurrentBairroId: Dispatch<SetStateAction<number | null>>;
  numberDenunciasInMap: NumeroDeDenunciasPorBairro[];
  setNumberDenunciasInMap: Dispatch<
    SetStateAction<NumeroDeDenunciasPorBairro[]>
  >;
};

type Coordinates = {
  lat: number;
  lng: number;
  level: number;
};

const MapActionsContext = createContext<
  SelectAcoesOuDenunciasProps | undefined
>(undefined);

export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [currentBairroId, setCurrentBairroId] = useState<null | number>(null);

  const [disableMapFilters, setDisableMapFilters] = useState(false);
  const [salvarDenunciasOnclick, setSalvarDenunciasOnClick] = useState(false);
  const [salvarAcaoOnclick, setSalvarAcaoOnclick] = useState(false);

  const [acaoSelecionada, setAcaoSelecionada] =
    useState<AcaoDetailsModel | null>(null);
  const [denunciasSelecionadas, setDenunciasSelecionadas] = useState<
    DenunciaInMap[]
  >([]);

  const [isSelectingNewDenuncia, setIsSelectingNewDenuncia] = useState(false);
  const [denunciasJaVinculadas, setDenunciasJaVinculadas] = useState<
    DenunciaModel[]
  >([]);
  const [zoomTo, setZoomTo] = useState<Coordinates | null>(null);
  const [newDenunciaCoordinates, setNewDenunciaCoordinates] =
    useState<null | Coordinates>(null);

  const [numberDenunciasInMap, setNumberDenunciasInMap] = useState<
    NumeroDeDenunciasPorBairro[]
  >([]);

  const value: SelectAcoesOuDenunciasProps = {
    salvarDenunciasOnclick,
    setSalvarDenunciasOnClick,
    salvarAcaoOnclick,
    setSalvarAcaoOnclick,
    acaoSelecionada,
    setAcaoSelecionada,
    denunciasSelecionadas,
    setDenunciasSelecionadas,
    disableMapFilters,
    setDisableMapFilters,
    toggleDenunciaSelecionadas,
    denunciasJaVinculadas,
    setDenunciasJaVinculadas,
    isSelectingNewDenuncia,
    setIsSelectingNewDenuncia,
    zoomTo,
    setZoomTo,
    newDenunciaCoordinates,
    setNewDenunciaCoordinates,
    toggleAcaoSelecionada,
    currentBairroId,
    setCurrentBairroId,
    numberDenunciasInMap,
    setNumberDenunciasInMap,
  };

  useEffect(() => {
    setDisableMapFilters(
      salvarAcaoOnclick || salvarDenunciasOnclick ? true : false,
    );
  }, [salvarAcaoOnclick, salvarDenunciasOnclick]);

  function toggleDenunciaSelecionadas(newDenuncia: DenunciaInMap) {
    if (denunciasSelecionadas.find((d) => d.id == newDenuncia.id)) {
      setDenunciasSelecionadas((denuncias) =>
        denuncias.filter((d) => d.id !== newDenuncia.id),
      );
    } else {
      setDenunciasSelecionadas((denuncias) => [...denuncias, newDenuncia]);
    }
  }

  function toggleAcaoSelecionada(acao: AcaoDetailsModel) {
    if (acaoSelecionada?.acao.id === acao.acao.id) {
      setAcaoSelecionada(null);
    } else {
      setAcaoSelecionada(acao);
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
