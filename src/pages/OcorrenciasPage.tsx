import { useState } from "react";
import type { Acao } from "../types/Acao";
import type { Denuncia } from "../types/Denuncia";
import { SidePanel } from "../components/SidePanel/SidePanel";
import { MapComponent } from "../components/Map/MapComponent";
import { useOcorrencias } from "../hooks/useOcorrencias";
import { CreateActionModal } from "../components/Modals/CreateActionModal";

export function OcorrenciasPage() {
    const { denuncias, acoes, criarNovaAcao } = useOcorrencias();

    const [modoSelecao, setModoSelecao] = useState<boolean>(false);
    const [denunciasSelecionadas, setDenunciasSelecionadas] = useState<number[]>([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [detailViewItem, setDetailViewItem] = useState<Denuncia | Acao | null>(null);

    const handleSelectionClick = (id: number) => {
        if (modoSelecao) {
            setDenunciasSelecionadas(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
        }
    }

    const handleItemClick = (item: Denuncia | Acao) => {
        setDetailViewItem(item);
    }

    const handleFinalizarCriacaoAcao = (nome: string, secretaria: string) => {
        const denunciasParaAcao = denuncias.filter(d => denunciasSelecionadas.includes(d.id));
        criarNovaAcao(nome, secretaria, denunciasParaAcao);
        setCreateModalOpen(false);
        setModoSelecao(false);
        setDenunciasSelecionadas([]);
    }

    return (
        <>
            <div className="flex flex-col md:flex-row h-screen font-sans bg-gray-100">
                <SidePanel
                    denuncias={denuncias} acoes={acoes} modoSelecao={modoSelecao}
                    denunciasSelecionadasCount={denunciasSelecionadas.length}
                    onIniciarSelecao={() => setModoSelecao(true)}
                    onAbrirFormulario={() => setCreateModalOpen(true)}
                    onCancelarSelecao={() => { 
                        setModoSelecao(false); 
                        setDenunciasSelecionadas([]); 
                    }}
                    onItemClick={handleItemClick}
                    detailViewItem={detailViewItem}
                    onBackToList={() => setDetailViewItem(null)}
                />

                <main className="flex-1 z-10 relative">
                    <MapComponent
                        denuncias={denuncias} acoes={acoes} modoSelecao={modoSelecao}
                        denunciasSelecionadas={denunciasSelecionadas}
                        onMarkerClick={handleItemClick}
                        onSelectionClick={handleSelectionClick}
                        detailViewItem={detailViewItem}
                    />
                </main>
            </div>

            <CreateActionModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleFinalizarCriacaoAcao}
                selectionCount={denunciasSelecionadas.length}
            />
        </>
    );
}