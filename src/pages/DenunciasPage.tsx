import { useMemo, useState } from "react";
import type { Acao, Denuncia } from "../types/ocorrencias";
import { SidePanel } from "../components/SidePanel/SidePanel";
import { MapComponent } from "../components/Map/MapComponent";
import { ActionDetailsModal, CreateActionModal } from "../components/Modals/ActionModals";
import { useOcorrencias } from "../hooks/useOcorrencias";
import type { StatusModel } from "../types/StatusModel";

export function DenunciasPage() {
    const { denuncias, acoes, criarNovaAcao } = useOcorrencias();
    const [modoSelecao, setModoSelecao] = useState<boolean>(false);
    const [denunciasSelecionadas, setDenunciasSelecionadas] = useState<number[]>([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
    const [acaoSelecionada, setAcaoSelecionada] = useState<Acao | null>(null);
    const [detailViewItem, setDetailViewItem] = useState<Denuncia | Acao | null>(null);

    const handleSelectItem = (item: Denuncia | Acao) => {
        setDetailViewItem(item);
    };
    const handleBackToList = () => {
        setDetailViewItem(null);
    };
    const handleMarkerClick = (id: number, status: StatusModel) => {
        if (modoSelecao && status === 'aberto') {
            setDenunciasSelecionadas(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
        }
    };
    const handleFinalizarCriacaoAcao = (nome: string, secretaria: string) => {
        const denunciasParaAcao = denuncias.filter(d => denunciasSelecionadas.includes(d.id));
        criarNovaAcao(nome, secretaria, denunciasParaAcao);
        setCreateModalOpen(false);
        setModoSelecao(false);
        setDenunciasSelecionadas([]);
    }

    const denunciasVinculadas = useMemo(() => {
        if (!acaoSelecionada) return [];
        return denuncias.filter(d => d.acaoId === acaoSelecionada.id);
    }, [acaoSelecionada, denuncias]);

    return (
        <div className="flex flex-col md:flex-row h-screen font-sans bg-gray-100">
            <SidePanel
                denuncias={denuncias} acoes={acoes} modoSelecao={modoSelecao}
                denunciasSelecionadasCount={denunciasSelecionadas.length}
                onIniciarSelecao={() => setModoSelecao(true)}
                onAbrirFormulario={() => setCreateModalOpen(true)}
                onCancelarSelecao={() => { setModoSelecao(false); setDenunciasSelecionadas([]); }}
                onItemClick={handleSelectItem}
                detailViewItem={detailViewItem}
                onBackToList={handleBackToList}
            />
            <main className="flex-1 z-10">
                <MapComponent
                    denuncias={denuncias}
                    acoes={acoes}
                    modoSelecao={modoSelecao}
                    denunciasSelecionadas={denunciasSelecionadas}
                    onMarkerClick={handleMarkerClick}
                    onAcaoClick={handleSelectItem}
                />
            </main>
            <CreateActionModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={handleFinalizarCriacaoAcao} selectionCount={denunciasSelecionadas.length} />
            <ActionDetailsModal isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} acao={acaoSelecionada} denunciasVinculadas={denunciasVinculadas} />
        </div>
    );
}