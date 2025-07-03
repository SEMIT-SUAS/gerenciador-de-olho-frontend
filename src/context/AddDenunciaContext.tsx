import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type AddDenunciaContextProps = {
    isSelectingNewDenunciaInMap: boolean,
    setIsSelectingNewDenunciaInMap: Dispatch<SetStateAction<boolean>>,
    newDenunciaCoordinates: LocationDataProps,
    setNewDenunciaCoordinates: Dispatch<SetStateAction<LocationDataProps>>
}

type AddDenunciaProviderProps = {
    children: ReactNode
}

type LocationDataProps = {
  longitude: number
  latitude: number
} | null 

export const AddDenunciaContext = createContext({} as AddDenunciaContextProps)

export function AddDenunciaProvider({ children }: AddDenunciaProviderProps) {
    const [isSelectingNewDenunciaInMap, setIsSelectingNewDenunciaInMap] = useState<boolean>(false)
    const [newDenunciaCoordinates, setNewDenunciaCoordinates] = useState<LocationDataProps>(null)

    return (
        <AddDenunciaContext.Provider value={{
            isSelectingNewDenunciaInMap,
            setIsSelectingNewDenunciaInMap,
            newDenunciaCoordinates,
            setNewDenunciaCoordinates
        }}>
            {children}
        </AddDenunciaContext.Provider>
    )
}