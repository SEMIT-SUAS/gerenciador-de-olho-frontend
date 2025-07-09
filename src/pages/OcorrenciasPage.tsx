import { useState, useEffect } from 'react'
import type { Acao } from '../types/Acao'
import type { Denuncia } from '../types/Denuncia'
import { SidePanel } from '../components/SidePanel/SidePanel'
import { MapComponent } from '../components/Map/MapComponent'
import { useOcorrenciasContext } from '../context/OcorrenciasContext'
import { AddDenunciaProvider } from '../context/AddDenunciaContext'
import { IndeferirDenunciaProvider } from '../context/IndeferirDenunciaContext'
import { VincularDenunciaProvider, useVincularDenunciaContext } from '../context/vincularDenunciaContext'
import { ConfirmModal } from '../components/Modals/ConfirmModal'


export type ZoomToProps = {
  lat: number
  lng: number
} | null

export function OcorrenciasPage() {
  const { denuncias, setDenuncias, acoes, actualDetailItem, setActualDetailItem, loading, error } = useOcorrenciasContext()
  const [modoSelecao, setModoSelecao] = useState<boolean>(false)
  const [denunciasSelecionadas, setDenunciasSelecionadas] = useState<number[]>([])
  const [zoomTo, setZoomTo] = useState<ZoomToProps>(null)
  const [isOpen, setIsOpen] = useState(false);
  const { denunciaParaVincular, confirmLink, setAcaoParaVincular, acaoParaVincular } = useVincularDenunciaContext();


    useEffect(() => {
        if (acaoParaVincular) {
            setIsOpen(true);
        }
    }, [acaoParaVincular]);

    const handleConfirm = () => {
        if (acaoParaVincular) {
            confirmLink(acaoParaVincular.id);
        }
        setIsOpen(false);
        setAcaoParaVincular(null);
    };

    const handleCancel = () => {
        setIsOpen(false);
        setAcaoParaVincular(null);
    };
  
  const handleSelectionClick = (id: number) => {
    if (modoSelecao) {
      setDenunciasSelecionadas(prev => prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id])
    }
  }

  const handleItemClick = (item: Denuncia | Acao, zoomToData: ZoomToProps) => {
    setZoomTo(zoomToData)
    setActualDetailItem(item)
  }



  if (loading) return <div className="flex h-screen w-screen items-center justify-center">Carregando...</div>
  if (error) return <div className="flex h-screen w-screen items-center justify-center">Erro: {error}</div>

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <VincularDenunciaProvider>
        <IndeferirDenunciaProvider>
          <AddDenunciaProvider>
            <SidePanel
              denuncias={denuncias}
              acoes={acoes}
              modoSelecao={modoSelecao}
              denunciasSelecionadasCount={denunciasSelecionadas.length}
              setDenuncias={setDenuncias}
              onItemClick={handleItemClick}
              detailViewItem={actualDetailItem}
              onBackToList={() => setActualDetailItem(null)}
            />

            <main className="flex-1 z-10 relative">
              <MapComponent
                denuncias={denuncias}
                acoes={acoes}
                modoSelecao={modoSelecao}
                denunciasSelecionadas={denunciasSelecionadas}
                onMarkerClick={handleItemClick}
                onSelectionClick={handleSelectionClick}
                detailViewItem={actualDetailItem}
                zoomTo={zoomTo}
                setZoomTo={setZoomTo}
              />
            </main>
              <ConfirmModal
                isOpen={isOpen}
                title="Vínculo de denúncia à ação"
                message={`Deseja vincular a denúncia "${denunciaParaVincular?.tipo}" à ação "${acaoParaVincular?.nome}"?`}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
          </AddDenunciaProvider>
        </IndeferirDenunciaProvider>
      </VincularDenunciaProvider>
    </div>
  )
}
