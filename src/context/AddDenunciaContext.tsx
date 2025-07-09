import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type AddDenunciaContextProps = {
  isSelectingNewDenunciaInMap: boolean;
  setIsSelectingNewDenunciaInMap: Dispatch<SetStateAction<boolean>>;
  newDenunciaCoordinates: LocationDataProps;
  setNewDenunciaCoordinates: Dispatch<SetStateAction<LocationDataProps>>;
  isAddingDenuncia: boolean;
  setIsAddingDenuncia: Dispatch<SetStateAction<boolean>>;
};

type AddDenunciaProviderProps = {
  children: ReactNode;
};

type LocationDataProps = {
  longitude: number;
  latitude: number;
} | null;

export const AddDenunciaContext = createContext({} as AddDenunciaContextProps);

export function AddDenunciaProvider({ children }: AddDenunciaProviderProps) {
  const [isAddingDenuncia, setIsAddingDenuncia] = useState(false);
  const [isSelectingNewDenunciaInMap, setIsSelectingNewDenunciaInMap] =
    useState<boolean>(false);
  const [newDenunciaCoordinates, setNewDenunciaCoordinates] =
    useState<LocationDataProps>(null);

  return (
    <AddDenunciaContext.Provider
      value={{
        isSelectingNewDenunciaInMap,
        setIsSelectingNewDenunciaInMap,
        newDenunciaCoordinates,
        setNewDenunciaCoordinates,
        isAddingDenuncia,
        setIsAddingDenuncia,
      }}
    >
      {children}
    </AddDenunciaContext.Provider>
  );
}

export function useAddDenuncia() {
  return useContext(AddDenunciaContext);
}
