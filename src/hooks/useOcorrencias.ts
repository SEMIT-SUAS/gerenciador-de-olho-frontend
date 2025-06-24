import { useState } from 'react';
import type { Denuncia, Acao } from '../types/ocorrencias.ts';
import { DADOS_INICIAIS_ACOES, DADOS_INICIAIS_DENUNCIAS } from '../data/initialData.ts';
import { getConvexHull } from '../utils/geometry.ts';

export const useOcorrencias = () => {
    const [denuncias, setDenuncias] = useState<Denuncia[]>(DADOS_INICIAIS_DENUNCIAS);
    const [acoes, setAcoes] = useState<Acao[]>(DADOS_INICIAIS_ACOES);

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
            polygonCoords,
        };

        setAcoes(prev => [...prev, novaAcao]);
        setDenuncias(prev => prev.map(d => denunciasParaAcao.find(sel => sel.id === d.id) ? { ...d, status: 'em_atendimento', acaoId: novaAcao.id } : d));
    };

    return { denuncias, acoes, criarNovaAcao };
};