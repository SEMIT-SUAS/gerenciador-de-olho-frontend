import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { AcaoInMap } from '../types/Acao';
import { type DenunciaInMap, type DenunciaModel } from '../types/Denuncia';
import type { NumeroDeDenunciasPorBairro } from '@/types/Bairro';
import { toast } from 'sonner';

type SelectAcoesOuDenunciasProps = {
  salvarDenunciasOnclick: boolean;
  setSalvarDenunciasOnClick: Dispatch<SetStateAction<boolean>>;
  salvarAcaoOnclick: boolean;
  setSalvarAcaoOnclick: Dispatch<SetStateAction<boolean>>;
  acaoSelecionada: AcaoInMap | null;
  setAcaoSelecionada: Dispatch<SetStateAction<AcaoInMap | null>>;
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
  toggleAcaoSelecionada: (acao: AcaoInMap) => void;
  currentBairroId: number | null;
  setCurrentBairroId: Dispatch<SetStateAction<number | null>>;
  numberDenunciasInMap: NumeroDeDenunciasPorBairro[];
  setNumberDenunciasInMap: Dispatch<
    SetStateAction<NumeroDeDenunciasPorBairro[]>
  >;
  denunciasVinculadas: DenunciaInMap[];
  setDenunciaVinculadas: Dispatch<SetStateAction<DenunciaInMap[]>>;
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

  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoInMap | null>(
    null,
  );
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

  const [denunciasVinculadas, setDenunciaVinculadas] = useState<
    DenunciaInMap[]
  >([]);

  const value: SelectAcoesOuDenunciasProps = {
    salvarDenunciasOnclick,
    denunciasVinculadas,
    setDenunciaVinculadas,
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
      if (denunciasSelecionadas.length > 0) {
        const referenceType = denunciasSelecionadas[0].nomeTipoDenuncia;
        if (newDenuncia.nomeTipoDenuncia !== referenceType) {
          toast.error(
            `Apenas denúncias do tipo "${referenceType}" podem ser selecionadas em conjunto.`,
          );
          return;
        }
      }

      setDenunciasSelecionadas((denuncias) => [...denuncias, newDenuncia]);
    }
  }

  function toggleAcaoSelecionada(acao: AcaoInMap) {
    if (acaoSelecionada?.id === acao.id) {
      setAcaoSelecionada(null);
    } else {
      setAcaoSelecionada(acao);
      // setDenunciaVinculadas(
      //   denunciasDoBairro.filter(
      //     (denunciaBairro) => denunciaBairro.idAcao === acaoSelecionada?.id,
      //   ),
      // );
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
