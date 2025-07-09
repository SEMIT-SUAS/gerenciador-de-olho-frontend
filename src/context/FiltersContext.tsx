import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

type FiltersContextProps = {
  isVisibleDenunciasInMap: boolean
  isVisibleAcoesInMap: boolean
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>
}

const FiltersContext = createContext({} as FiltersContextProps)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [isVisibleDenunciasInMap, setIsVisibleDenunciasInMap] = useState(true)
  const [isVisibleAcoesInMap, setIsVisibleAcoesInMap] = useState(true)

  return (
    <FiltersContext.Provider value={{
      isVisibleDenunciasInMap,
      isVisibleAcoesInMap,
      setIsVisibleDenunciasInMap,
      setIsVisibleAcoesInMap,
    }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  return useContext(FiltersContext)
}
