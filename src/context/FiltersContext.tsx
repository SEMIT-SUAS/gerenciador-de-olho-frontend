import {createContext,useContext,useState,type Dispatch,type ReactNode,type SetStateAction,} from 'react'
import type { StatusModel } from '../types/StatusModel'
import type { Categorias } from '../types/CategoriaDenuncia'
import type { Secretarias } from '../types/Secretaria'

type FiltersContextProps = {
  isVisibleDenunciasInMap: boolean
  isVisibleAcoesInMap: boolean
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>
  filtroStatusDenuncia: 'todos' | StatusModel
  setFiltroStatusDenuncia: Dispatch<SetStateAction<'todos' | StatusModel>>
  filtroStatusAcao: 'todos' | StatusModel
  setFiltroStatusAcao: Dispatch<SetStateAction<'todos' | StatusModel>>
  filtroCategoria: 'todas' | Categorias | null
  setFiltroCategoria: Dispatch<SetStateAction<'todas' | Categorias | null>>
  filtroSecretaria: 'todas' | Secretarias | null
  setFiltroSecretaria: Dispatch<SetStateAction<'todas' | Secretarias | null>>
}

const FiltersContext = createContext({} as FiltersContextProps)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [isVisibleDenunciasInMap, setIsVisibleDenunciasInMap] = useState(true)
  const [isVisibleAcoesInMap, setIsVisibleAcoesInMap] = useState(true)

  const [filtroStatusDenuncia, setFiltroStatusDenuncia] = useState<'todos' | StatusModel>('aberto');
  const [filtroStatusAcao, setFiltroStatusAcao] = useState<'todos' | StatusModel>('aberto');
  const [filtroCategoria, setFiltroCategoria] = useState<'todas' | Categorias | null>('todas');
  const [filtroSecretaria, setFiltroSecretaria] = useState<'todas' | Secretarias | null>('todas');

  return (
    <FiltersContext.Provider value={{
      isVisibleDenunciasInMap,
      isVisibleAcoesInMap,
      setIsVisibleDenunciasInMap,
      setIsVisibleAcoesInMap,
      filtroStatusDenuncia,
      setFiltroStatusDenuncia,
      filtroStatusAcao,
      setFiltroStatusAcao,
      filtroCategoria,
      setFiltroCategoria,
      filtroSecretaria,
      setFiltroSecretaria
    }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  return useContext(FiltersContext)
}
