import { useState, useMemo } from 'react';
import type { FC } from 'react';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';
import { ItemDetailsView } from './ItemDetailsView';
import { DenunciasList } from './DenunciasList';
import { AcoesList } from './AcoesList';
import type { StatusModel } from '../../types/StatusModel';


interface SidePanelProps {
    denuncias: Denuncia[];
    acoes: Acao[];
    modoSelecao: boolean;
    denunciasSelecionadasCount: number;
    onIniciarSelecao: () => void;
    onAbrirFormulario: () => void;
    onCancelarSelecao: () => void;
    onItemClick: (item: Denuncia | Acao) => void;
    detailViewItem: Denuncia | Acao | null;
    onBackToList: () => void;
}

export const SidePanel: FC<SidePanelProps> = ({
    denuncias,
    acoes,
    modoSelecao,
    denunciasSelecionadasCount,
    onIniciarSelecao,
    onAbrirFormulario,
    onCancelarSelecao,
    onItemClick,
    detailViewItem,
    onBackToList
}) => {
    const [abaAtiva, setAbaAtiva] = useState<'denuncias' | 'acoes'>('denuncias');
    const [filtroStatus, setFiltroStatus] = useState<'todos' | StatusModel>('todos');

    const denunciasFiltradas = useMemo(() => {
        if (filtroStatus === 'todos') {
            return denuncias;
        }
        return denuncias.filter(d => d.status === filtroStatus);
    }, [denuncias, filtroStatus]);

    const getFilterButtonStyle = (status: typeof filtroStatus) => {
        return filtroStatus === status
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    };

    return (
        <aside className="w-full md:w-[450px] bg-white shadow-lg flex flex-col z-20 h-screen">
            <div className="p-4"><h1 className="text-2xl font-bold text-gray-800">Painel de Ocorrências</h1></div>

            <div className="flex-1 overflow-y-auto">
                {detailViewItem ? (
                    <ItemDetailsView item={detailViewItem} denuncias={denuncias} onBack={onBackToList} />
                ) : (
                    <>
                        <div className="">
                            <nav className="flex">
                                <button onClick={() => setAbaAtiva('denuncias')} className={`flex-1 p-4 text-center font-medium ${abaAtiva === 'denuncias' ? 'text-blue-600  border-b-2 border-blue-600' : 'text-gray-500'}`}>Denúncias ({denuncias.length})</button>
                                <button onClick={() => setAbaAtiva('acoes')} className={`flex-1 p-4 text-center font-medium ${abaAtiva === 'acoes' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}>Ações ({acoes.length})</button>
                            </nav>
                        </div>
                        {abaAtiva === 'denuncias' && (
                            <div className="p-4">
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                    <button onClick={() => setFiltroStatus('todos')} className={`px-2 py-1 rounded-md transition-colors ${getFilterButtonStyle('todos')}`}>Todos</button>
                                    <button onClick={() => setFiltroStatus('aberto')} className={`px-2 py-1 rounded-md transition-colors ${getFilterButtonStyle('aberto')}`}>Abertas</button>
                                    <button onClick={() => setFiltroStatus('em_andamento')} className={`px-2 py-1 rounded-md transition-colors ${getFilterButtonStyle('em_andamento')}`}>Atendimento</button>
                                    <button onClick={() => setFiltroStatus('concluido')} className={`px-2 py-1 rounded-md transition-colors ${getFilterButtonStyle('concluido')}`}>Concluídas</button>
                                </div>
                            </div>
                        )}
                        <div className="p-4 space-y-3">
                            {modoSelecao && (<div className="p-3 bg-blue-100 border-blue-300 text-blue-800 rounded-lg text-center font-semibold">Modo de Seleção Ativo: Clique nos pinos no mapa.</div>)}

                            {abaAtiva == 'denuncias'
                                ? <DenunciasList denuncias={denunciasFiltradas} onItemClick={onItemClick} />
                                : <AcoesList acoes={acoes} onItemClick={onItemClick} />}
                        </div>
                    </>
                )}
            </div>

            {!detailViewItem && (
                <div className="p-4 space-y-2">
                    {!modoSelecao ? (
                        <button onClick={onIniciarSelecao} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Iniciar Criação de Ação</button>
                    ) : (
                        <>
                            <button onClick={onAbrirFormulario} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">Revisar e Nomear Ação ({denunciasSelecionadasCount})</button>
                            <button onClick={onCancelarSelecao} className="w-full bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">Cancelar</button>
                        </>
                    )}
                </div>
            )}
        </aside>
    );
};