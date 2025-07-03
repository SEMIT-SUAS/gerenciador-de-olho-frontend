import { createContext, useContext, useEffect, useState} from 'react';
import type { FC, ReactNode } from 'react';
import type { Denuncia } from '../types/Denuncia';
import type { Acao } from '../types/Acao';
import denunciasService from '../services/denunciasService';
import acoesService from '../services/acoesService';

interface OcorrenciasContextType {
    denuncias: Denuncia[];
    acoes: Acao[];
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
    
    const value = { denuncias, acoes, loading, error, vincularDenunciaAcao };

    return <OcorrenciasContext.Provider value={value}>{children}</OcorrenciasContext.Provider>;
};

export const useOcorrenciasContext = () => {
    const context = useContext(OcorrenciasContext);
    if (context === undefined) throw new Error('useOcorrenciasContext deve ser usado dentro de um OcorrenciasProvider');
    return context;
};