import { useState } from "react";
import type { Acao } from "../types/Acao";
import type { Denuncia } from "../types/Denuncia";
import { SidePanel } from "../components/SidePanel/SidePanel";
import { MapComponent } from "../components/Map/MapComponent";
import { useOcorrenciasContext } from "../context/ocorrenciasContext";
import { AddDenunciaProvider } from "../context/AddDenunciaContext";


export function OcorrenciasPage() {
    const { denuncias, setDenuncias, acoes, actualDetailItem, setActualDetailItem  } = useOcorrenciasContext();
    const [modoSelecao, setModoSelecao] = useState<boolean>(false);
    const [denunciasSelecionadas, setDenunciasSelecionadas] = useState<number[]>([]);

    const handleSelectionClick = (id: number) => {
        if (modoSelecao) {
            setDenunciasSelecionadas(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
        }
    }

    const handleItemClick = (item: Denuncia | Acao) => {
        setActualDetailItem(item);
    }

     const { loading, error } = useOcorrenciasContext();

    if (loading) return <div className="flex h-screen w-screen items-center justify-center">Carregando...</div>;
    if (error) return <div className="flex h-screen w-screen items-center justify-center">Erro: {error}</div>;

    return (
        <>
            <div className="flex flex-col md:flex-row h-screen bg-gray-100">
                <AddDenunciaProvider>
                    <SidePanel
                        denuncias={denuncias} acoes={acoes} modoSelecao={modoSelecao}
                        denunciasSelecionadasCount={denunciasSelecionadas.length}
                        onItemClick={handleItemClick}
                        detailViewItem={actualDetailItem}
                        onBackToList={() => setActualDetailItem(null)}
                        setDenuncias={setDenuncias}
                    />

                    <main className="flex-1 z-10 relative">
                        <MapComponent
                            denuncias={denuncias} acoes={acoes} modoSelecao={modoSelecao}
                            denunciasSelecionadas={denunciasSelecionadas}
                            onMarkerClick={handleItemClick}
                            onSelectionClick={handleSelectionClick}
                            detailViewItem={actualDetailItem}
                        />
                    </main>
                </AddDenunciaProvider>
            </div>
        </>
    );
}