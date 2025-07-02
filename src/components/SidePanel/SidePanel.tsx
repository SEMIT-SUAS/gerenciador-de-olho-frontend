import { useState, useMemo } from 'react';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';
import { ItemDetailsView } from './ItemDetailsView';
import { DenunciasList } from './DenunciasList';
import { AcoesList } from './AcoesList';
import type { StatusModel } from '../../types/StatusModel';
import { FilterButtons } from './FilterButtons';
import { IoIosAdd, IoIosClose } from 'react-icons/io';
import { AddDenunciaForm } from '../Forms/AddDenunciaForm';

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

export function SidePanel({
    denuncias,
    acoes,
    modoSelecao,
    denunciasSelecionadasCount,
    onIniciarSelecao,
    onAbrirFormulario,
    onCancelarSelecao,
    onItemClick,
    detailViewItem,
    onBackToList,
}: SidePanelProps) {
    const [abaAtiva, setAbaAtiva] = useState<'denuncias' | 'acoes'>('denuncias');
    const [filtroStatusDenuncia, setFiltroStatusDenuncia] = useState<'todos' | StatusModel>('todos');
    const [filtroStatusAcao, setFiltroStatusAcao] = useState<'todos' | StatusModel>('todos');
    const [isAddingDenuncia, setIsAddingDenuncia] = useState(false)

    const denunciasFiltradas = useMemo(() => {
        if (filtroStatusDenuncia === 'todos') {
            return denuncias;
        }

        return denuncias.filter(d => d.status === filtroStatusDenuncia);
    }, [denuncias, filtroStatusDenuncia]);

    const acoesFiltradas = useMemo(() => {
        if (filtroStatusAcao === 'todos') {
            return acoes;
        }
        return acoes.filter(a => a.status === filtroStatusAcao);
    }, [acoes, filtroStatusAcao]);

    return (
        <>
            <aside className="w-full md:w-[450px] bg-white shadow-lg flex flex-col z-20 h-screen">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-2xl font-bold text-gray-800">Painel de Ocorrências</h1>
                    {isAddingDenuncia ? (
                        <button
                            onClick={() => setIsAddingDenuncia(false)}
                            aria-label='Cancelar'
                            className='p-1 rounded-full bg-red-600 cursor-pointer'
                        >
                            <IoIosClose
                                size={36}
                                color='white'
                            />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsAddingDenuncia(true)}
                            aria-label='Adicionar denúncia'
                            className='p-1 rounded-full bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                            disabled={modoSelecao}
                        >
                            <IoIosAdd
                                size={36}
                                color='white'
                            />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {detailViewItem && !isAddingDenuncia &&
                        <ItemDetailsView
                            item={detailViewItem}
                            denuncias={denuncias}
                            onBack={onBackToList}
                        />
                    }

                    {isAddingDenuncia && 
                    <AddDenunciaForm />}

                    {!detailViewItem && !isAddingDenuncia &&
                        <>
                            <div>
                                <nav className="flex">
                                    <button onClick={() => setAbaAtiva('denuncias')} className={`flex-1 p-4 text-center font-medium ${abaAtiva === 'denuncias' ? 'text-blue-600  border-b-2 border-blue-600' : 'text-gray-500'}`}>Denúncias ({denuncias.length})</button>
                                    <button onClick={() => setAbaAtiva('acoes')} className={`flex-1 p-4 text-center font-medium ${abaAtiva === 'acoes' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}>Ações ({acoes.length})</button>
                                </nav>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                    {abaAtiva == 'denuncias' ? (
                                        <FilterButtons
                                            setFilterStatus={setFiltroStatusDenuncia}
                                            currentFilter={filtroStatusDenuncia}
                                        />
                                    ) : (
                                        <FilterButtons
                                            setFilterStatus={setFiltroStatusAcao}
                                            currentFilter={filtroStatusAcao}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                {modoSelecao && (<div className="p-3 bg-blue-100 border-blue-300 text-blue-800 rounded-lg text-center font-semibold">Modo de Seleção Ativo: Clique nos pinos no mapa.</div>)}

                                {abaAtiva == 'denuncias'
                                    ? <DenunciasList denuncias={denunciasFiltradas} onItemClick={onItemClick} />
                                    : <AcoesList acoes={acoesFiltradas} onItemClick={onItemClick} />}
                            </div>
                        </>
                    }
                </div>

                {!detailViewItem && !isAddingDenuncia && (
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
        </>
    );
};