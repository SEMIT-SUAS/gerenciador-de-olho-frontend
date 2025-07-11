import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type SidePanelViews = 'LISTAR_DENUNCIAS' | 'LISTAR_ACOES';

type SidePanelRoutesContextProps = {
  sidePanelContentView: SidePanelViews;
  setSidePanelContentView: Dispatch<SetStateAction<SidePanelViews>>;
};

const SidePanelRoutesContext = createContext({} as SidePanelRoutesContextProps);

export function SidePanelRoutesProvider({ children }: { children: ReactNode }) {
  const [sidePanelContentView, setSidePanelContentView] =
    useState<SidePanelViews>('LISTAR_DENUNCIAS');

  return (
    <SidePanelRoutesContext.Provider
      value={{
        sidePanelContentView,
        setSidePanelContentView,
      }}
    >
      {children}
    </SidePanelRoutesContext.Provider>
  );
}

export function useSidePanelRoutes() {
  return useContext(SidePanelRoutesContext);
}
