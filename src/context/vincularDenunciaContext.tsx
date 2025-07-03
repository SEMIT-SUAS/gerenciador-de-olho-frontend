import { createContext, useContext, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { useOcorrenciasContext } from './ocorrenciasContext';
import type { Denuncia } from '../types/Denuncia';

interface VincularDenunciaContextType {
    denunciaParaVincular: Denuncia | null;
    startLinking: (denuncia: Denuncia) => void;
    cancelLinking: () => void;
    confirmLink: (acaoId: number) => void;
}

const VincularDenunciaContext = createContext<VincularDenunciaContextType | undefined>(undefined);

export const VincularDenunciaProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { vincularDenunciaAcao } = useOcorrenciasContext();
    const [denunciaParaVincular, setDenunciaParaVincular] = useState<Denuncia | null>(null);

    const startLinking = (denuncia: Denuncia) => {
        setDenunciaParaVincular(denuncia);
    };

    const cancelLinking = () => {
        setDenunciaParaVincular(null);
    };

    const confirmLink = (acaoId: number) => {
        if (denunciaParaVincular) {
            vincularDenunciaAcao(denunciaParaVincular.id, acaoId);
            setDenunciaParaVincular(null);
        }   
    };

    const value = { denunciaParaVincular, startLinking, cancelLinking, confirmLink };

    return <VincularDenunciaContext.Provider value={value}>{children}</VincularDenunciaContext.Provider>;
};

export const useVincularDenunciaContext = () => {
    const context = useContext(VincularDenunciaContext);
    if (context === undefined) throw new Error('useLinkActionContext deve ser usado dentro de um LinkActionProvider');
    return context;
};
