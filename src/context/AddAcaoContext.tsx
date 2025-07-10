import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Denuncia } from '../types/Denuncia';

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
