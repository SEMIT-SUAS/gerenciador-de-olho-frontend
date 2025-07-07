import type { Denuncia } from "../types/Denuncia";
import { createContext, useState, useContext, type FC, type ReactNode } from "react";
import { useOcorrenciasContext } from "./ocorrenciasContext";

interface IndeferirDenunciaContextType {
    denunciaParaIndeferir: Denuncia | null;
    startIndeferir: (denuncia: Denuncia) => void;
    cancelIndeferir: () => void;
    confirmIndeferir: (motivoStatus: string) => void;
}

const IndeferirDenunciaContext = createContext<IndeferirDenunciaContextType | undefined>(undefined);

export const IndeferirDenunciaProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { indeferirDenuncia } = useOcorrenciasContext();
    const [denunciaParaIndeferir, setDenunciaParaIndeferir] = useState<Denuncia | null>(null);

    const startIndeferir = (denuncia: Denuncia) => setDenunciaParaIndeferir(denuncia);
    const cancelIndeferir = () => setDenunciaParaIndeferir(null);
    const confirmIndeferir = (motivoStatus: string) => {
        if (denunciaParaIndeferir) {
            indeferirDenuncia(denunciaParaIndeferir.id, 'indeferido', motivoStatus);
            setDenunciaParaIndeferir(null);
        }
    };

    const value = { denunciaParaIndeferir, startIndeferir, cancelIndeferir, confirmIndeferir };
    return <IndeferirDenunciaContext.Provider value={value}>{children}</IndeferirDenunciaContext.Provider>;
};

export const useIndeferirDenunciaContext = () => {
    const context = useContext(IndeferirDenunciaContext);
    if (context === undefined) throw new Error('useIndeferirDenunciaContext deve ser usado dentro de um IndeferirDenunciaProvider');
    return context;
};
