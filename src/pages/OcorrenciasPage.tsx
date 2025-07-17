import { useMemo, useState } from 'react';
import type { Acao } from '../types/Acao';
import type { Denuncia } from '../types/Denuncia';
import { SidePanel } from '../components/SidePanel/SidePanel';
import { MapComponent } from '../components/Map/MapComponent';
import { useOcorrenciasContext } from '../context/ocorrenciasContext';
import { AddDenunciaProvider } from '../context/AddDenunciaContext';
import { IndeferirDenunciaProvider } from '../context/IndeferirDenunciaContext';
import { VincularDenunciaProvider } from '../context/vincularDenunciaContext';
import { useFilters } from '../context/FiltersContext';

export type ZoomToProps = {
  lat: number;
  lng: number;
} | null;

export function OcorrenciasPage() {
  const {
    denuncias,
    acoes,
    actualDetailItem,
    setActualDetailItem,
    loading,
    error,
  } = useOcorrenciasContext();
  const [modoSelecao, setModoSelecao] = useState<boolean>(false);
  const [denunciasSelecionadas, setDenunciasSelecionadas] = useState<number[]>(
    [],
  );
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [zoomTo, setZoomTo] = useState<ZoomToProps>(null);
  const {
    filtroStatusDenuncia,
    filtroStatusAcao,
    filtroCategoria,
    filtroSecretaria,
  } = useFilters();

  const handleSelectionClick = (id: number) => {
    if (modoSelecao) {
      setDenunciasSelecionadas((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    }
  };

  const denunciasFiltradas = useMemo(() => {
    let filtered = [...denuncias];

    if (filtroStatusDenuncia !== 'todos') {
      filtered = filtered.filter((d) => d.status === filtroStatusDenuncia);
    }

    if (filtroCategoria !== 'todas') {
      filtered = filtered.filter((d) => d.categoria.name === filtroCategoria);
    }

    return filtered;
  }, [denuncias, filtroStatusDenuncia, filtroCategoria]);

  const acoesFiltradas = useMemo(() => {
    let filtered = [...acoes];

    if (filtroStatusAcao !== 'todos') {
      filtered = filtered.filter((a) => a.status === filtroStatusAcao);
    }

    if (filtroSecretaria !== 'todas') {
      filtered = filtered.filter((a) => a.secretaria.name === filtroSecretaria);
    }

    return filtered;
  }, [acoes, filtroStatusAcao, filtroSecretaria]);

  const handleItemClick = (item: Denuncia | Acao, zoomToData: ZoomToProps) => {
    setZoomTo(zoomToData);
    setActualDetailItem(item);
  };

  if (loading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Carregando...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Erro: {error}
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <VincularDenunciaProvider>
        <IndeferirDenunciaProvider>
          <AddDenunciaProvider>
            <SidePanel
              denuncias={denunciasFiltradas}
              acoes={acoesFiltradas}
              modoSelecao={modoSelecao}
              denunciasSelecionadasCount={denunciasSelecionadas.length}
              onIniciarSelecao={() => setModoSelecao(true)}
              onAbrirFormulario={() => setCreateModalOpen(true)}
              onCancelarSelecao={() => {
                setModoSelecao(false);
                setDenunciasSelecionadas([]);
              }}
              onItemClick={handleItemClick}
              detailViewItem={actualDetailItem}
              onBackToList={() => setActualDetailItem(null)}
            />

            <main className="flex-1 z-10 relative">
              <MapComponent
                denuncias={denunciasFiltradas}
                acoes={acoesFiltradas}
                modoSelecao={modoSelecao}
                denunciasSelecionadas={denunciasSelecionadas}
                onMarkerClick={handleItemClick}
                onSelectionClick={handleSelectionClick}
                detailViewItem={actualDetailItem}
                zoomTo={zoomTo}
                setZoomTo={setZoomTo}
              />
            </main>
          </AddDenunciaProvider>
        </IndeferirDenunciaProvider>
      </VincularDenunciaProvider>
    </div>
  );
}
