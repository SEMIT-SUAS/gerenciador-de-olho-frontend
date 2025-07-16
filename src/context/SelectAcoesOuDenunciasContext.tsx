import { createContext, useContext, type ReactNode } from 'react';

type SelectAcoesOuDenunciasProps = {};

const SelectAcoesOuDenunciasContext = createContext<
  SelectAcoesOuDenunciasProps | undefined
>(undefined);

export function SelectAcoesOuDenunciasProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SelectAcoesOuDenunciasContext.Provider value={{}}>
      {children}
    </SelectAcoesOuDenunciasContext.Provider>
  );
}

export function useSelectAcoesOuDenuncias() {
  const context = useContext(SelectAcoesOuDenunciasContext);

  if (!context)
    throw new Error(
      'For access context data must the component being child of context provider',
    );

  return context;
}
