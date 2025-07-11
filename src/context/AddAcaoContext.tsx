import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Denuncia } from '../types/Denuncia';
import { useFilters } from './FiltersContext';

type AddAcaoContextProps = {
  isAddingAcao: boolean;
  setIsAddingAcao: Dispatch<SetStateAction<boolean>>;
  denunciasVinculadas: Denuncia[];
  setDenunciasVinculadas: Dispatch<SetStateAction<Denuncia[]>>;
};

const AddAcaoContext = createContext({} as AddAcaoContextProps);

export function AddAcaoProvider({ children }: { children: React.ReactNode }) {
  const [isAddingAcao, setIsAddingAcao] = useState(false);
  const [denunciasVinculadas, setDenunciasVinculadas] = useState<Denuncia[]>(
    [],
  );

  const { setIsVisibleAcoesInMap, setFiltroDenunciasComAcao } = useFilters();

  useEffect(() => {
    if (isAddingAcao) {
      setIsVisibleAcoesInMap(false);
      setFiltroDenunciasComAcao('sem_acao');
    } else {
      setIsVisibleAcoesInMap(true);
      setFiltroDenunciasComAcao('desabilitado');
    }

    setDenunciasVinculadas([]);
  }, [isAddingAcao]);

  return (
    <AddAcaoContext.Provider
      value={{
        isAddingAcao,
        setIsAddingAcao,
        denunciasVinculadas,
        setDenunciasVinculadas,
      }}
    >
      {children}
    </AddAcaoContext.Provider>
  );
}

export function useAddAcao() {
  return useContext(AddAcaoContext);
}
