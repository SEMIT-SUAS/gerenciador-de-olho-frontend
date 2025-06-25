import { useEffect, useState } from 'react';
import type { Denuncia, Acao } from '../types/ocorrencias.ts';
import { DADOS_INICIAIS_ACOES, DADOS_INICIAIS_DENUNCIAS } from '../data/initialData.ts';
import { getConvexHull } from '../utils/geometry.ts';
import type { StatusModel } from '../types/StatusModel.ts';

export type filterProps = {
    mapPins: 'all' | 'denuncias' | 'acoes',
    status: 'all' | StatusModel,
}

type filteredDataProps = {
    denuncias: Denuncia[]
    acoes: Acao[]
}

export const useOcorrencias = () => {
    const [denuncias, setDenuncias] = useState<Denuncia[]>(DADOS_INICIAIS_DENUNCIAS);
    const [acoes, setAcoes] = useState<Acao[]>(DADOS_INICIAIS_ACOES);

    const [filter, setFilter] = useState<filterProps>({
        mapPins: 'all',
        status: 'all'
    })

    const [filteredData, setFilteredData] = useState<filteredDataProps>({
        denuncias: [],
        acoes: []
    })

    useEffect(() => {
        let denunciasTemp = [...denuncias];
        let acoesTemp = [...acoes];

        if (filter.status !== 'all') {
            denunciasTemp = denunciasTemp.filter(d => d.status === filter.status);
            acoesTemp = acoesTemp.filter(a => a.status === filter.status);
        }

        let denunciasFinais: Denuncia[] = [];
        let acoesFinais: Acao[] = [];

        switch (filter.mapPins) {
            case 'denuncias':
                denunciasFinais = denunciasTemp;
            break;

            case 'acoes':
                acoesFinais = acoesTemp;
            break;

            default:
                denunciasFinais = denunciasTemp;
                acoesFinais = acoesTemp;
            break;
        }
        
        setFilteredData({ denuncias: denunciasFinais, acoes: acoesFinais });
    }, [acoes, denuncias, filter])

    const criarNovaAcao = (nomeAcao: string, secretariaAcao: string, denunciasParaAcao: Denuncia[]) => {
        if (denunciasParaAcao.length === 0 || !nomeAcao || !secretariaAcao) {
            alert("Dados insuficientes para criar a ação.");
            return;
        }

        const centroide = denunciasParaAcao.reduce((acc, curr) => ({ lat: acc.lat + curr.lat, lon: acc.lon + curr.lon }), { lat: 0, lon: 0 });
        centroide.lat /= denunciasParaAcao.length;
        centroide.lon /= denunciasParaAcao.length;

        const polygonCoords = denunciasParaAcao.length >= 3 ? getConvexHull(denunciasParaAcao) : [];

        const novaAcao: Acao = {
            id: Math.max(...acoes.map(a => a.id), 100) + 1,
            nome: nomeAcao,
            secretaria: secretariaAcao,
            lat: centroide.lat,
            lon: centroide.lon,
            status: 'aberto',
            polygonCoords,
        };

        setAcoes(prev => [...prev, novaAcao]);
        setDenuncias(prev => prev.map(d => denunciasParaAcao.find(sel => sel.id === d.id) ? { ...d, status: 'em_andamento', acaoId: novaAcao.id } : d));
    };

    return { denuncias, acoes, criarNovaAcao, filteredData, setFilter };
};