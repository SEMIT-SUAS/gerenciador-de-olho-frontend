import { DenunciasList } from '../components/SidePanel/Denuncia/DenunciasList';
import { AcoesList } from '../components/SidePanel/Acao/AcoesList';
import type { ReactNode } from 'react';

export type SidePanelRoute = {
  name: string;
  component: ReactNode;
};

export const sidePanelRoutes = [
  {
    name: 'LIST_DENUNCIAS',
    component: DenunciasList,
  },
  {
    name: 'LIST_ACOES',
    component: AcoesList,
  },
];
