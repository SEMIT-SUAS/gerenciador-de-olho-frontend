import { useEffect, useState } from "react";
import { getConvexHull } from "../utils/geometry.ts";
import type { Denuncia } from "../types/Denuncia.ts";
import type { Acao } from "../types/Acao.ts";
import denunciasService from "../services/denunciasService.ts";
import acoesService from "../services/acoesService.ts";

export const useOcorrencias = () => {
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
          acoesService.getAllAcoes(),
        ]);
        setDenuncias(denunciasData);
        setAcoes(acoesData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const criarNovaAcao = (
    nomeAcao: string,
    secretariaAcao: string,
    denunciasParaAcao: Denuncia[]
  ) => {
    if (denunciasParaAcao.length === 0 || !nomeAcao || !secretariaAcao) {
      alert("Dados insuficientes para criar a ação.");
      return;
    }

    console.log(denunciasParaAcao)

    const centroide = denunciasParaAcao.reduce(
      (acc, curr) => ({
        lat: acc.lat + curr.endereco.latitude,
        lon: acc.lon + curr.endereco.longitude,
      }),
      { lat: 0, lon: 0 }
    );
    
    centroide.lat /= denunciasParaAcao.length;
    centroide.lon /= denunciasParaAcao.length;

    const polygonCoords =
      denunciasParaAcao.length >= 3 ? getConvexHull(denunciasParaAcao) : [];

    const novaAcao: Acao = {
      id: Math.max(...acoes.map((a) => a.id), 100) + 1,
      nome: nomeAcao,
      secretaria: secretariaAcao,
      lat: centroide.lat,
      lon: centroide.lon,
      status: "aberto",
      polygonCoords,
    };

    setAcoes((prev) => [...prev, novaAcao]);
    setDenuncias((prev) =>
      prev.map((d) =>
        denunciasParaAcao.find((sel) => sel.id === d.id)
          ? { ...d, status: "em_andamento", acaoId: novaAcao.id }
          : d
      )
    );
  };

  return {
    loading,
    error,
    denuncias,
    acoes,
    criarNovaAcao,
  };
};
