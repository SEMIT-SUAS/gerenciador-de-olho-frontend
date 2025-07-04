import { createContext, useContext, useEffect, useState} from 'react';
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import type { Denuncia } from '../types/Denuncia';
import type { Acao } from '../types/Acao';
import denunciasService from '../services/denunciasService';
import acoesService from '../services/acoesService';

interface OcorrenciasContextType {
    denuncias: Denuncia[];
    setDenuncias: Dispatch<SetStateAction<Denuncia[]>>
    actualDetailItem: Denuncia | Acao | null;
    setActualDetailItem: Dispatch<SetStateAction<Denuncia | Acao | null>>;
    acoes: Acao[];
    setAcoes: Dispatch<SetStateAction<Acao[]>>
    loading: boolean;
    error: string | null;
    vincularDenunciaAcao: (denunciaId: number, acaoId: number) => Promise<void>;
}

const OcorrenciasContext = createContext<OcorrenciasContextType | undefined>(undefined);


export const OcorrenciasProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
    const [acoes, setAcoes] = useState<Acao[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actualDetailItem, setActualDetailItem] = useState<Denuncia | Acao | null>(null);


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [denunciasData, acoesData] = await Promise.all([
                    denunciasService.getAllDenuncias(),
                    acoesService.getAllAcoes()
                ]);
                setDenuncias(denunciasData);
                setAcoes(acoesData);
            } catch (err: any) { setError(err.message); } finally { setLoading(false); }
        };
        loadData();
    }, []);


    const vincularDenunciaAcao = async (denunciaId: number, acaoId: number) => {
        try {
            const denunciaAtualizada = await denunciasService.vincularDenunciaToAcao(denunciaId, acaoId);
            setDenuncias(prev => prev.map(d => d.id === denunciaId ? denunciaAtualizada : d));
            console.log("Denúncia vinculada com sucesso:", denunciaAtualizada);
        } catch (error) {   
            console.error("Falha ao vincular denúncia:", error);
            alert("Não foi possível vincular a denúncia.");
        }
    };
    
    const value = { denuncias, setDenuncias, acoes, setAcoes, actualDetailItem, setActualDetailItem, loading, error, vincularDenunciaAcao };

    return <OcorrenciasContext.Provider value={value}>{children}</OcorrenciasContext.Provider>;
};

export const useOcorrenciasContext = () => {
    const context = useContext(OcorrenciasContext);
    if (context === undefined) throw new Error('useOcorrenciasContext deve ser usado dentro de um OcorrenciasProvider');
    return context;
};