import { useState, type FC } from 'react';
import { useVincularDenunciaContext } from '../../context/vincularDenunciaContext';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';
import type { Acao } from '../../types/Acao';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { BackButton } from '../Buttons/Backbutton';

export const VincularAcaoView: FC = () => {
    const { acoes, setActualDetailItem } = useOcorrenciasContext();
    const [isOpen, setIsOpen] = useState(false);
    const [currentAcao, setCurrentAcao] = useState<Acao | null>(null);
    const { denunciaParaVincular, confirmLink, cancelLinking } = useVincularDenunciaContext();

    if (!denunciaParaVincular) return null;

    function handleOnConfirmLink(acao: Acao) {
        confirmLink(acao.id)
        setActualDetailItem(acao);
    }

    function handleOnSelectAcao(acao: Acao) {
        setIsOpen(true);
        setCurrentAcao(acao)
    }

    return (
        <>
        <div className="p-4 flex flex-col h-full">
            <BackButton
                onClick={cancelLinking} 
                className="text-lg">
                Retornar à pagina anterior 
                </BackButton>
            <div className="mb-4 p-3 bg-blue-50 border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">Vinculando denúncia:</p>
                <p className="font-bold text-blue-900">{denunciaParaVincular.titulo}</p>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Selecione uma Ação Existente:</h3>
            <div className="flex-1 rounded-lg overflow-y-auto bg-gray-50 space-y-2 p-2">
                {acoes.map(acao => (
                    <button key={acao.id} onClick={() => handleOnSelectAcao(acao)} className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
                        <p className="font-semibold text-gray-700">{acao.nome}</p>
                    </button>
                ))}
            </div>
        </div>

        <ConfirmModal 
        isOpen={isOpen} 
        title={"Vínculo de denúncia à ação"} 
        message={`Você deseja vincular essa denúncia ${denunciaParaVincular.tipo} à essa ação ${currentAcao?.nome}?`} 
        onCancel={cancelLinking}
        onConfirm={() => handleOnConfirmLink(currentAcao!)}
         />
        </>
    )
};